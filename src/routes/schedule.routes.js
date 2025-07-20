const express = require("express");
const router = express.Router();
const scheduleMessageController = require("../controllers/schedule.controller");

router.route("/schedule")
.post(scheduleMessageController.scheduleMessage)

module.exports = router;
