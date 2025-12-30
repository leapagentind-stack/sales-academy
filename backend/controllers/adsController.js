const Ads = require("../models/Ads");

exports.getAds = async (req, res) => {
  try {
    const data = await Ads.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
