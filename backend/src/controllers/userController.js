const prisma = require("../config/db.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  try {
    const id = req.userId;

    // Fetch user and related data
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        avatar_url: true,
        university: true,
        major: true,
        year: true,
        location: true,
        bio: true,
        website: true,
        created_at: true,
        updated_at: true,

        // Relations
        events: { select: { id: true, title: true, date: true, is_virtual: true } },
        eventAttendees: { 
          select: { event: { select: { id: true, title: true, date: true } } } 
        },
        forumTopics: { select: { id: true, title: true, created_at: true } },
        forumReplies: { select: { id: true, content: true, created_at: true } },
        resources: { select: { id: true, title: true, category: true, fileUrl: true } },
        notifications: { select: { id: true, type: true, message: true, is_read: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      full_name,
      university,
      major,
      year,
      location,
      bio,
      website,
    } = req.body;
    let finalAvatarUrl;
    // If file is uploaded, send it to Cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(
        req.file.buffer,
        "avatars",
        `user_${userId}_${Date.now()}`
      );
      finalAvatarUrl = result.secure_url;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        full_name,
        university,
        major,
        year,
        location,
        bio,
        website,
        avatar_url: finalAvatarUrl,
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        role: true,
        university: true,
        major: true,
        year: true,
        location: true,
        bio: true,
        website: true,
        avatar_url: true,
        updated_at: true,
      },
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

