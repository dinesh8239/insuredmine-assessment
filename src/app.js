const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Routes
const uploadRoutes = require("./routes/upload.route");
const policyRoutes = require("./routes/policy.route");
const scheduleRoutes = require("./routes/schedule.routes");

app.use("/api/policy", policyRoutes);
app.use("/api/upload", uploadRoutes)
app.use("/api/schedule", scheduleRoutes);



module.exports = app;
