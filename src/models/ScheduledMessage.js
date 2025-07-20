const mongoose = require("mongoose");

const scheduledMessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "sent"],
    default: "pending",
  },
});

module.exports = mongoose.model("ScheduledMessage", scheduledMessageSchema);
