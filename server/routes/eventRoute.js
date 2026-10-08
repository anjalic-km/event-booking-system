const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken");
const EventModel = require("../models/eventModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the assets/media folder exists
const uploadDir = path.join(__dirname, "../assets/media");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config — saves files locally into server/assets/media/
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Prefix with timestamp to avoid name collisions
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    // Allow images and videos only
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|mkv/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

// POST /api/events/upload-media
// Accepts multiple files under the field name "media"
// Returns the array of accessible URLs
router.post(
  "/upload-media",
  validateToken,
  upload.array("media"),
  (req, res) => {
    try {
      const files = req.files;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      // Build public URLs for each saved file
      const urls = files.map(
        (file) =>
          `${req.protocol}://${req.get("host")}/assets/media/${file.filename}`,
      );
      return res.status(200).json({ urls });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
);

// POST /api/events/create-event
router.post("/create-event", validateToken, async (req, res) => {
  try {
    const event = await EventModel.create(req.body);
    return res
      .status(201)
      .json({ message: "Event Created Successfully", event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// PUT /api/events/edit-event/:id
router.put("/edit-event/:id", validateToken, async (req, res) => {
  try {
    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ message: "Event Updated Successfully", event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE /api/events/delete-event/:id
router.delete("/delete-event/:id", validateToken, async (req, res) => {
  try {
    const event = await EventModel.findByIdAndDelete(req.params.id);
    return res.json({ message: "Event Deleted Successfully", event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/events/get-events
router.get("/get-events", validateToken, async (req, res) => {
  try {
    const searchText = req.query.search || "";
    const date = req.query.date;

    const query = {};
    if (searchText) {
      query.name = { $regex: new RegExp(searchText, "i") };
    }
    if (date) {
      query.date = date;
    }

    const events = await EventModel.find(query).sort({ createdAt: -1 });
    return res.json({ data: events });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// GET /api/events/get-event/:id
router.get("/get-event/:id", validateToken, async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    return res.json({ data: event });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;