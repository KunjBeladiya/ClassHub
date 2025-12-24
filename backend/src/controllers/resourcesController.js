const prisma = require("../config/db.js");
const uploadToCloudinary = require("../utils/uploadToCloudinary.js");
const filesize = require("filesize").default;

const getResources = async (req, res) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json({ success: true, resources }); // send the resources as JSON response
  } catch (error) {
    console.error("error in getResources:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const uploadResource = async (req, res) => {
  try {
    const file = req.file;
    
    const { title, description, categoryId, category} = req.body;

    if (!file) return res.status(400).json({ error: "File is required" });

    const cloudResult = await uploadToCloudinary(
      file.buffer,
      "campus-resources",
      file.originalname.split(".")[0]
    );

    const uploader = req.userId;
    const fileSize = file.size.toString(); 

    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        categoryId,
        category,
        fileType: file.mimetype,
        fileSize, // e.g., "2.4 MB"
        fileUrl: cloudResult.secure_url,
        uploaderId:uploader,
      },
    });

    res.status(201).json({ message: "Resource uploaded", resource: newResource });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

const deleteResource = async (req, res) => {
  try {
    const { id } = req.params; // resource ID
    const userId = req.userId;  // set by auth middleware

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }

    // Delete resource
    await prisma.resource.delete({
      where: { id },
    });

    return res.json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


module.exports = { getResources, uploadResource , deleteResource };
