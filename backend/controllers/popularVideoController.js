// backend/controllers/popularVideosController.js
// Fetch videos for a given popular course (course_id)

exports.getVideosByCourse = async (req, res) => {
  try {
    const db = global.db;
    const courseId = req.params.courseId;

    if (!courseId) {
      return res.status(400).json({ message: "courseId required" });
    }

    // Query: using promise pool (mysql2/promise)
    const [rows] = await db.query(
      "SELECT id, course_id, title, video_url, thumbnail FROM popular_videos WHERE course_id = ?",
      [courseId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching popular course videos:", err);
    res.status(500).json({ message: "Error fetching videos" });
  }
};
