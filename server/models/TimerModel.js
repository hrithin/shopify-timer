const mongoose = require("mongoose");

const TimerSchema = new mongoose.Schema({
  storeDomain: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  promotionText: { type: String, required: true },
  displayOptions: {
    color: String,
    position: String,
    size: String,
  },
  urgency: {
    enabled: Boolean,
    triggerMinutes: Number
  },
}, { timestamps: true });

module.exports = mongoose.model("timers", TimerSchema);