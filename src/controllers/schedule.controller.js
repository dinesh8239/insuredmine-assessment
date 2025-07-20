const ScheduledMessage = require("../models/ScheduledMessage");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

//Create Scheduled Message
exports.scheduleMessage = asyncHandler(async (req, res) => {
  try {
    const { message, day, time } = req.body;

    if (!message || !day || !time) {
      throw new ApiError(400, "message, day, and time are required");
    }

    const scheduledDate = new Date(`${day}T${time}:00`);

    if (isNaN(scheduledDate.getTime())) {
      throw new ApiError(400, "Invalid day or time format");
    }

    const newMessage = await ScheduledMessage.create({
      message,
      scheduledAt: scheduledDate,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, newMessage, "Message scheduled"));
  } catch (error) {
    throw new ApiError(500, error?.message || "Failed to schedule message");
  }
});
