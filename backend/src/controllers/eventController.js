const prisma = require("../config/db.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");

// -------------------------
// 📌 Create Event
// -------------------------
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      is_virtual,
      max_attendees,
    } = req.body;

    let image_url = null;
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "events",
        Date.now()
      );
      image_url = result.secure_url;
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        location,
        category,
        is_virtual: is_virtual === "true",
        max_attendees: max_attendees ? Number(max_attendees) : null,
        image_url,
        organizer_id: req.userId,
      },
    });

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Update Event
// -------------------------
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });

    // Only organizer can update
    if (existing.organizer_id !== req.userId)
      return res.status(403).json({ success: false, message: "Not allowed." });

    let image_url = existing.image_url;
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "events",
        Date.now()
      );
      image_url = uploaded.secure_url;
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : existing.date,
        image_url,
      },
    });

    res.json({ success: true, event: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Delete Event
// -------------------------
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const existing = await prisma.event.findUnique({ where: { id: eventId } });
    if (!existing)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    if (existing.organizer_id !== req.userId)
      return res.status(403).json({ success: false, message: "Not allowed" });

    await prisma.event.delete({ where: { id: eventId } });

    res.json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Get All Events
// -------------------------
exports.getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
      include: {
        attendees: true,
        organizer: { select: { full_name: true, avatar_url: true } },
      },
    });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Get Event By ID
// -------------------------
exports.getEventById = async (req, res) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
      include: {
        organizer: {
          select: {
            full_name: true,
            avatar_url: true,
            email: true,
          },
        },
        attendees: {
          include: { user: { select: { full_name: true, avatar_url: true } } },
        },
      },
    });

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Join Event
// -------------------------
exports.joinEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    // max attendee check
    if (event.max_attendees) {
      const count = await prisma.eventAttendee.count({
        where: { event_id: eventId },
      });
      if (count >= event.max_attendees) {
        return res.json({ success: false, message: "Event is full." });
      }
    }

    // prevent duplicate join
    await prisma.eventAttendee.create({
      data: { event_id: eventId, user_id: req.userId },
    });

    res.json({ success: true, message: "Joined successfully!" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.json({ success: false, message: "Already joined." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Leave Event
// -------------------------
exports.leaveEvent = async (req, res) => {
  try {
    await prisma.eventAttendee.delete({
      where: {
        event_id_user_id: {
          event_id: req.params.id,
          user_id: req.userId,
        },
      },
    });

    res.json({ success: true, message: "Left event successfully." });
  } catch (error) {
    res
      .status(400)
      .json({
        success: false,
        message: "You are not registered for this event.",
      });
  }
};

// -------------------------
// 📌 My Registered Events
// -------------------------
exports.myRegisteredEvents = async (req, res) => {
  try {
    const events = await prisma.eventAttendee.findMany({
      where: { user_id: req.userId },
      include: { event: true },
    });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -------------------------
// 📌 Events Created by Me
// -------------------------
exports.myCreatedEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { organizer_id: req.userId },
    });

    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
