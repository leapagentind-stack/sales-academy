const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔍 SEARCH COURSES
router.get("/", async (req, res) => {
  const q = req.query.q;

  if (!q) {
    return res.json({ success: true, data: [] });
  }

  try {
    const [recommended] = await db.query(
      `SELECT id, title, image AS thumbnail, 'recommended' AS type
       FROM recommended_courses
       WHERE title LIKE ?`,
      [`%${q}%`]
    );

    const [popular] = await db.query(
      `SELECT id, title, image AS thumbnail, 'popular' AS type
       FROM popular_courses
       WHERE title LIKE ?`,
      [`%${q}%`]
    );

    const [newCourses] = await db.query(
      `SELECT id, title, image AS thumbnail, 'new' AS type
       FROM new_courses
       WHERE title LIKE ?`,
      [`%${q}%`]
    );

    res.json({
      success: true,
      data: [...recommended, ...popular, ...newCourses],
    });
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ success: false, message: "Search failed" });
  }
});

module.exports = router;
