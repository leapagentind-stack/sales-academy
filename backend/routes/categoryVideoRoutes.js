const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get videos by category slug + level
router.get("/category/:slug", async (req, res) => {
  const { slug } = req.params;
  const { level } = req.query;

  try {
    const [rows] = await db.execute(
      `SELECT cv.id, cv.title, cv.level, cv.video_url, cv.thumbnail_url
       FROM categories_videos cv
       JOIN categories c ON cv.category_id = c.id
       WHERE c.slug = ? AND cv.level = ?`,
      [slug, level]
    );

    return res.json(rows);
  } catch (err) {
    console.error("Category Videos Error:", err);
    res.status(500).json({ message: "Error fetching category videos" });
  }
});

module.exports = router;
