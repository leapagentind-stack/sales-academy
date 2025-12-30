const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, image, link FROM ads");
    res.json(rows);
  } catch (err) {
    console.error("Ads Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch ads" });
  }
});

module.exports = router;
