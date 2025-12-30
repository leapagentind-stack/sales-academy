const express = require("express");
const router = express.Router();
const db = require("../db");

// CHECK IF STUDENT IS ENROLLED
router.get("/check", async (req, res) => {
  const { studentId, courseId, courseType } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT id FROM enrollments 
       WHERE studentId=? AND courseId=? AND courseType=?`,
      [studentId, courseId, courseType]
    );

    res.json({ enrolled: rows.length > 0 });
  } catch (err) {
    console.error("Enrollment check error:", err);
    res.status(500).json({ enrolled: false });
  }
});

module.exports = router;
