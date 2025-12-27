const express = require("express");
const db = require("../config/db");

const router = express.Router();

/* --------------------------------
   ADD TO CART
-------------------------------- */
router.post("/add", async (req, res) => {
  const { studentId, courseId, courseType } = req.body;

  // ✅ validation
  if (!studentId || !courseId || !courseType) {
    return res.status(400).json({
      message: "Missing required fields"
    });
  }

  try {
    // 🔒 Already enrolled → BLOCK
    const [enrolled] = await db.query(
      `SELECT id FROM enrollments 
       WHERE studentId=? AND courseId=? AND courseType=?`,
      [studentId, courseId, courseType]
    );

    if (enrolled.length > 0) {
      return res.status(409).json({ message: "Already enrolled" });
    }

    // 🛒 Already in cart → BLOCK
    const [existing] = await db.query(
      `SELECT id FROM cart 
       WHERE studentId=? AND courseId=? AND courseType=?`,
      [studentId, courseId, courseType]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Already in cart" });
    }

    await db.query(
      `INSERT INTO cart (studentId, courseId, courseType)
       VALUES (?, ?, ?)`,
      [studentId, courseId, courseType]
    );

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------
   GET CART
-------------------------------- */
router.get("/:studentId", async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID required" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.courseId,
        c.courseType,
        CASE 
          WHEN c.courseType='recommended' THEN rc.title
          WHEN c.courseType='popular' THEN pc.title
          WHEN c.courseType='new' THEN nc.title
        END AS title,
        CASE 
          WHEN c.courseType='recommended' THEN rc.image
          WHEN c.courseType='popular' THEN pc.image
          WHEN c.courseType='new' THEN nc.image
        END AS thumbnail,
        CASE 
          WHEN c.courseType='recommended' THEN rc.price
          WHEN c.courseType='popular' THEN pc.price
          WHEN c.courseType='new' THEN nc.price
        END AS price
      FROM cart c
      LEFT JOIN recommended_courses rc 
        ON c.courseType='recommended' AND rc.id=c.courseId
      LEFT JOIN popular_courses pc 
        ON c.courseType='popular' AND pc.id=c.courseId
      LEFT JOIN new_courses nc 
        ON c.courseType='new' AND nc.id=c.courseId
      WHERE c.studentId = ?
      `,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------
   BUY / ENROLL ALL CART ITEMS
-------------------------------- */
router.post("/buy", async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: "Student ID required" });
  }

  try {
    const [cartItems] = await db.query(
      "SELECT * FROM cart WHERE studentId=?",
      [studentId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (let item of cartItems) {
      await db.query(
        `INSERT IGNORE INTO enrollments
         (studentId, courseId, courseType, progress)
         VALUES (?, ?, ?, 0)`,
        [studentId, item.courseId, item.courseType]
      );
    }

    await db.query("DELETE FROM cart WHERE studentId=?", [studentId]);

    res.json({ message: "Purchase successful" });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------
   REMOVE FROM CART
-------------------------------- */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM cart WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Removed from cart" });
  } catch (err) {
    console.error("Remove cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
