const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send OTP Email
async function sendOTPEmail(userEmail, otp) {
  const mailOptions = {
    from: process.env.USER,
    to: userEmail,
    subject: "Your OTP Code for Verification",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", userEmail);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
}

module.exports = {generateOTP , sendOTPEmail}