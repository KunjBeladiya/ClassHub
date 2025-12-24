const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const prisma = require("../config/db.js");

exports.adminSignup = async (req, res) => {
  const { full_name, email, password } = req.body;

  try {
    // check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.user.create({
      data: {
        full_name,
        email,
        password: hashedPassword,
        role: "ADMIN", // 🔥 important
        authProvider: "CREDENTIALS"
      },
    });

    return res.status(201).json({ success: true, message: "Admin registered successfully", admin: newAdmin });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // find user
    const admin = await prisma.user.findUnique({ where: { email } });

    if (!admin) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // check role
    if (admin.role !== "ADMIN") {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized as admin" });
    }

    // validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // generate JWT token
    const token = jwt.sign(
      { userId: admin.id, role: admin.role },
      process.env.SECERET_KEY, // ⚠ keep spelling same as env
      { expiresIn: "1h" }
    );

    // set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
        avatar_url: admin.avatar_url,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
};