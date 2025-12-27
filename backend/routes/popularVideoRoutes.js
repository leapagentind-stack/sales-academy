const express = require("express");
const router = express.Router();
const db = require("../config/db"); // <-- Correct Pool import

// GET Popular Videos by Course ID
router.get("/:id", async (req, res) => {
  const courseId = req.params.id;
  console.log("Requested Course ID:", courseId);

  try {
    const [rows] = await db.query(
      "SELECT * FROM popular_videos WHERE course_id = ?",
      [courseId]
    );

    console.log("Videos found:", rows.length);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching popular videos:", error);
    res.status(500).json({ message: "Server Error" });
  }
});



module.exports = router;
