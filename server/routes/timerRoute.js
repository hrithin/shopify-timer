const express = require("express");
const router = express.Router();
const Timer = require("../models/TimerModel");

// Create a timer
router.post("/", async (req, res) => {
  try {
    const timer = await Timer.create(req.body);
    res.status(201).json(timer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get timers for a store
router.get("/:storeDomain", async (req, res) => {
  try {
    const timers = await Timer.find({ storeDomain: req.params.storeDomain });
    res.json(timers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
