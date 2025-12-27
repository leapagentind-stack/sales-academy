const express = require("express");
const router = express.Router();
const db = require("../config/db");


// Get Popular Courses
router.get("/courses/popular", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM popular_courses");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching popular courses" });
  }
});

module.exports = router;
