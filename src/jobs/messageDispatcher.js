const cron = require("node-cron");
const ScheduledMessage = require("../models/ScheduledMessage");

const dispatchScheduledMessages = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const messages = await ScheduledMessage.find({
      scheduledAt: { $lte: now },
      status: "pending",
    });

    for (const msg of messages) {
      console.log(`Sending message: ${msg.message} at ${now.toISOString()}`);

      msg.status = "sent";
      await msg.save();
    }
  });
};

module.exports = dispatchScheduledMessages;
