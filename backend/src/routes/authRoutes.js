const express = require('express');
const router = express.Router();
const prisma = require("../config/db.js");
const jwt = require("jsonwebtoken");
const { validateRegistration, validateLogin, handleValidationErrors } = require('../middleware/validationMiddleware.js');
const { register, login , logoutUser , checkExistingUser , otpSender , verifyOtp} = require('../controllers/authController.js');
const authMiddleware = require("../middleware/authMiddleware.js");
const { use } = require('passport');

// Register route
router.post('/register',  register);

// Login route
router.post('/login', login);

router.get('/logout', logoutUser);

// check user's existance
router.post('/checkUser' , checkExistingUser)


router.post('/sendOTP' , otpSender);
router.post('/verifyOTP' , verifyOtp);

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.SECERET_KEY);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, full_name: true, email: true, role: true , avatar_url:true },
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
      avatar_url:user.avatar_url,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

module.exports = router;
