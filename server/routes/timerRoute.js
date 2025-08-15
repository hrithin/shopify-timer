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

// Delete a timer by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedTimer = await Timer.findByIdAndDelete(req.params.id);

    if (!deletedTimer) {
      return res.status(404).json({ error: "Timer not found" });
    }

    res.json({ message: "Timer deleted successfully", deletedTimer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
