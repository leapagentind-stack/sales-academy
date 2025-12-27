const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all new courses
router.get("/new", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM new_courses");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get videos by course id
router.get("/new/:id/videos", async (req, res) => {
  try {
    const courseId = req.params.id;
    const [rows] = await db.query(
      "SELECT * FROM new_videos WHERE course_id = ?",
      [courseId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
