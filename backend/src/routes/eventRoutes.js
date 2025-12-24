const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware.js");
const multer = require("multer");
const upload = multer(); // to handle image upload (buffer)
const eventController = require("../controllers/eventController.js");

// Create Event
router.post("/create", authMiddleware, upload.single("image"), eventController.createEvent);

// Update Event
router.put("/update/:id", authMiddleware, upload.single("image"), eventController.updateEvent);

// Delete Event
router.delete("/delete/:id", authMiddleware, eventController.deleteEvent);

// Get all events
router.get("/", eventController.getAllEvents);

// Get single event
router.get("/:id", eventController.getEventById);

// Join event
router.post("/:id/join", authMiddleware, eventController.joinEvent);

// Leave event
router.post("/:id/leave", authMiddleware, eventController.leaveEvent);

// My registered events
router.get("/me/registered", authMiddleware, eventController.myRegisteredEvents);

// Events created by me
router.get("/me/created", authMiddleware, eventController.myCreatedEvents);

module.exports = router;
