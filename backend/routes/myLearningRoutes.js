const express = require("express");
const router = express.Router();
const db = require("../db");

// GET My Learning
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  console.log(`📥 API HIT: /api/my-learning/${studentId}`);

  try {
    const sql = `
      SELECT 
        e.id AS enrollmentId,
        e.courseId,
        e.courseType,
        
        -- ✅ Check all tables including 'courses' (Teacher Uploads)
        COALESCE(rc.title, pc.title, nc.title, gen.title) AS title,
        
        -- ✅ Get Image from correct table
        COALESCE(rc.image, pc.image, nc.image, gen.thumbnail_url) AS thumbnail,
        
        e.progress
      FROM enrollments e
      LEFT JOIN recommended_courses rc 
        ON rc.id = e.courseId AND e.courseType = 'recommended'
      LEFT JOIN popular_courses pc 
        ON pc.id = e.courseId AND e.courseType = 'popular'
      LEFT JOIN new_courses nc 
        ON nc.id = e.courseId AND e.courseType = 'new'
        
      -- 🟢 NEW: Join the Teacher Uploads table (General courses)
      LEFT JOIN courses gen 
        ON gen.id = e.courseId AND e.courseType = 'general'
        
      WHERE e.studentId = ?
      ORDER BY e.id ASC;
    `;

    const result = await db.query(sql, [studentId]);
    const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

    res.json(rows);
  } catch (error) {
    console.error("🔥 My Learning DB Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;