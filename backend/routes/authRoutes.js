const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");


// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Find user
    const user = await User.findOne({ where: { email, role } });

    if (!user) {
      return res.status(404).json({ message: "User not found for this role" });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    return res.json({ message: "Login successful", role: user.role });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
