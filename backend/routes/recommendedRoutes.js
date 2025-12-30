const express = require("express");
const router = express.Router();
const db = require("../db");

// Get Recommended Courses
router.get("/courses/recommended", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM recommended_courses");
    res.json(rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error fetching recommended courses" });
  }
});



module.exports = router;
