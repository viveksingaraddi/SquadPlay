const express = require("express");
const Arena = require("../models/Arena");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ GET ALL ARENAS
router.get("/", async (req, res) => {
  try {
    const arenas = await Arena.find();
    res.json(arenas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch arenas" });
  }
});

// ✅ ADD NEW ARENA
router.post("/", protect, async (req, res) => {
  try {
    const arena = await Arena.create(req.body);
    res.status(201).json(arena);
  } catch (err) {
    res.status(500).json({ error: "Failed to create arena" });
  }
});

// ✅ GET ARENAS BY CITY
router.get("/search", async (req, res) => {
  try {
    const { city } = req.query;
    const arenas = await Arena.find({ city: new RegExp(city, "i") });
    res.json(arenas);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
