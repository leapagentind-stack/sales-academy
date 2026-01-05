const express = require('express');
const router = express.Router();
const db = require('../db'); 

// POST /api/offers/apply
router.post('/apply', (req, res) => {
    const { courseId, offerPrice, validity, coupon } = req.body;

    if (!courseId) {
        return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    const finalCoupon = (coupon && coupon.trim() !== "") ? coupon : null;

    const sql = `
        INSERT INTO course_offers (course_id, discount_price, validity, coupon_code)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        discount_price = VALUES(discount_price),
        validity = VALUES(validity),
        coupon_code = VALUES(coupon_code)
    `;

    db.query(sql, [courseId, offerPrice, validity, finalCoupon], (err, result) => {
        if (err) {
            console.error("Database Error:", err.message);
            // ⚠️ If DB fails, tell frontend immediately
            return res.status(500).json({ success: false, message: "Database Error" });
        }
        
        // ✅ Success: Reply immediately so frontend can show Toast
        return res.status(200).json({ 
            success: true, 
            message: "Offer applied successfully" 
        });
    });
});

module.exports = router;