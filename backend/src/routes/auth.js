const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  userSignup,
  userLogin,
  OAuthCallback,
  otpSender,
  verifyOtp,
  checkExistingUser,
} = require("../controllers/authController.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// POST /signup
router.post("/signup", userSignup);

// POST /login
router.post("/login", userLogin);

// GET /auth/google
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// GET /auth/google/callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  OAuthCallback
);

// GET /logout
router.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECERET_KEY);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, full_name: true, email: true, role: true },
    });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({
      success: true,
      userId: user.id,
      role: user.role, // ⭐ IMPORTANT
      full_name: user.full_name,
      email: user.email,
    });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// POST /checkUser
router.post("/checkUser", checkExistingUser);

// POST /sendOTP
router.post("/sendOTP", otpSender);

// POST /verifyOTP
router.post("/verifyOTP", verifyOtp);

module.exports = router;
