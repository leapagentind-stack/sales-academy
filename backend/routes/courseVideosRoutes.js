const express = require("express");
const router = express.Router();
const db = require("../db");

/* -------------------------------------------
   1. GET VIDEOS BY COURSE ID (ENROLLMENT CHECK)
------------------------------------------- */
router.get("/course/:courseId/:courseType", async (req, res) => {
  const { courseId, courseType } = req.params;
  const studentId = req.query.studentId; // frontend will send this

  try {
    // 🔒 CHECK ENROLLMENT
    const [enrolled] = await db.query(
      `SELECT id FROM enrollments 
       WHERE studentId=? AND courseId=? AND courseType=?`,
      [studentId, courseId, courseType]
    );

    if (enrolled.length === 0) {
      return res.status(403).json({
        success: false,
        message: "Please enroll to watch this course",
      });
    }

    // 📹 VIDEO TABLE MAP
    const tableMap = {
      recommended: "recommended_videos",
      popular: "popular_videos",
      new: "new_videos",
    };

    const table = tableMap[courseType];

    if (!table) {
      return res.json({ success: true, videos: [] });
    }

    const [rows] = await db.query(
      `SELECT id, title, video_url FROM ${table} WHERE course_id = ?`,
      [courseId]
    );

    res.json({ success: true, videos: rows });
  } catch (err) {
    console.error("Video Fetch Error:", err);
    res.status(500).json({ message: "Failed to load videos" });
  }
});

/* -------------------------------------------
   2. UPDATE COURSE PROGRESS
------------------------------------------- */
router.post("/progress", async (req, res) => {
  const { studentId, courseId, courseType, completed, total } = req.body;

  const progress = Math.round((completed / total) * 100);

  try {
    await db.query(
      `UPDATE enrollments 
       SET progress = ?
       WHERE studentId = ? AND courseId = ? AND courseType = ?`,
      [progress, studentId, courseId, courseType]
    );

    res.json({ success: true, progress });
  } catch (err) {
    console.error("Progress Update Error:", err);
    res.status(500).json({ message: "Progress update failed" });
  }
});


module.exports = router;
