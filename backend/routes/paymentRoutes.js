const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const db = require("../config/db");

const router = express.Router();
console.log("Razorpay Key:", process.env.RAZORPAY_KEY_ID);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* CREATE ORDER */
router.post("/create-order", async (req, res) => {
  const { amount, studentId } = req.body;

  console.log("CREATE ORDER BODY:", req.body);

  try {
    console.log("Amount:", amount);
    console.log("Student ID:", studentId);

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    console.log("Razorpay Order Created:", order.id);

    await db.query(
      `INSERT INTO payments (studentId, amount, razorpay_order_id, status)
       VALUES (?, ?, ?, 'created')`,
      [studentId, amount, order.id]
    );

    res.json(order);
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* VERIFY PAYMENT */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      studentId
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ENROLL COURSES
    const [cartItems] = await db.query(
      "SELECT * FROM cart WHERE studentId=?",
      [studentId]
    );

    for (let item of cartItems) {
      await db.query(
        `INSERT IGNORE INTO enrollments
         (studentId, courseId, courseType, progress)
         VALUES (?, ?, ?, 0)`,
        [studentId, item.courseId, item.courseType]
      );
    }

    await db.query("DELETE FROM cart WHERE studentId=?", [studentId]);

    res.json({ success: true });
  } catch (err) {
    console.error("Payment verify error:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

module.exports = router;
