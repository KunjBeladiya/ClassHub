const express = require("express");
const router = express.Router();
const { getUserProfile , updateUserProfile } = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js"); // optional if profile needs login
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Get user profile by ID
router.get("/me", authMiddleware, getUserProfile);
// Update profile
router.put("/update", authMiddleware, upload.single("avatar"), updateUserProfile);


module.exports = router;
