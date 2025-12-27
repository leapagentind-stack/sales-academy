const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ⭐ GET My Learning
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  console.log("API HIT: /api/my-learning/" + studentId);

  try {
    const [rows] = await db.query(
  `
  SELECT 
    e.id AS enrollmentId,
    e.courseId,
    e.courseType,
    COALESCE(rc.title, pc.title, nc.title) AS title,
    COALESCE(rc.image, pc.image, nc.image) AS thumbnail,
    e.progress
  FROM enrollments e
  LEFT JOIN recommended_courses rc 
    ON rc.id = e.courseId AND e.courseType = 'recommended'
  LEFT JOIN popular_courses pc 
    ON pc.id = e.courseId AND e.courseType = 'popular'
  LEFT JOIN new_courses nc 
    ON nc.id = e.courseId AND e.courseType = 'new'
  WHERE e.studentId = ?
  ORDER BY e.id ASC;
  `,
  [studentId]
);

    console.log("DB RESULT:", rows);

    res.json(rows);
  } catch (error) {
    console.error("My Learning DB Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
