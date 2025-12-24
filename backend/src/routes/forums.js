const express = require("express");
const router = express.Router();

const { createForum } = require("../controllers/forumContoller.js");
const authMiddleware = require("../middleware/authMiddleware.js");

router.post('/forum',authMiddleware , createForum);