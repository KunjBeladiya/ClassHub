const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const prisma = require("../config/db.js");
const Sib = require("@sendinblue/client");

const register = async (req, res) => {
  const { email, password, username } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "User with this email already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      full_name: username,
      authProvider: "CREDENTIALS",
    },
  });

  // Send response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, process.env.SECERET_KEY, {
    expiresIn: "1h",
  });

  // Set cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // must be true when SameSite = "none"
    sameSite: "none", // allow cross-site cookies
    path: "/",
    maxAge: 60 * 60 * 1000,
  });

  const safeUser = {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };

  // Send response
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: safeUser,
  });
};

const checkExistingUser = async (req, res) => {
  console.log("check user runniing...");

  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) return res.json({ success: false, message: "User Alredy Exist" });

    return res.json({ success: true, message: "User not Exist" });
  } catch (error) {
    console.log(error);
  }
};

const client = new Sib.TransactionalEmailsApi();
client.setApiKey(
  Sib.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send OTP Email
async function sendOTPEmail(userEmail, otp) {
  try {
    await client.sendTransacEmail({
      sender: { name: "Your App", email: process.env.BREVO_SENDER_EMAIL },
      to: [{ email: userEmail }],
      subject: "Your OTP Code",
      textContent: `Your OTP code is ${otp}.`,
    });

    console.log("OTP sent to:", userEmail);
  } catch (err) {
    console.error("Email failed:", err?.response?.body || err);
  }
}

const otpSender = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  const otp = generateOTP();
  req.session.otp = otp; // Store OTP in session
  console.log("send-otp", req.session.otp);

  await sendOTPEmail(email, otp);

  res.json({ success: true, message: "OTP sent to email" });
};

const verifyOtp = (req, res) => {
  const { otp } = req.body;

  console.log("Received OTP:", typeof req.body.otp, otp);
  console.log("Received OTP:", typeof parseInt(otp));
  console.log(
    "Stored OTP in session:",
    typeof req.session.otp,
    req.session.otp
  );

  if (!otp)
    return res
      .status(400)
      .json({ success: false, message: "OTP is required!" });

  if (parseInt(otp) === parseInt(req.session.otp)) {
    req.session.otp = null; // Clear OTP after successful verification
    return res.json({ success: true, message: "OTP verified successfully!" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP!" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token"); // or your cookie/session name
  res.json({ success: true, message: "Logged out successfully" });
};

module.exports = {
  register,
  login,
  checkExistingUser,
  otpSender,
  verifyOtp,
  logoutUser,
};
