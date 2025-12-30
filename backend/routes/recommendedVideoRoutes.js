const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/recommended-videos/:courseId", async (req, res) => {
  try {
    const courseId = req.params.courseId;
    console.log("Requested Recommended Course ID:", courseId);

    const [videos] = await db.query(
      "SELECT * FROM recommended_videos WHERE course_id = ?",
      [courseId]
    );

    console.log("Recommended Videos found:", videos.length);

    res.json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ message: "Error fetching recommended videos" });
  }
});


module.exports = router;
