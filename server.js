const app = require("./src/app.js")
const connectDB = require('./src/config/db.js');
require('dotenv').config();
const monitorCPU = require("./src/utils/cpuMonitor.js");
const dispatchScheduledMessages = require('./src/jobs/messageDispatcher.js');
dispatchScheduledMessages();

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);

        })
        
    });
    monitorCPU();