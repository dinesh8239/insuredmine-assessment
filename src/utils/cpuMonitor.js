const pidusage = require('pidusage');
const { exec } = require('child_process');
const ApiError = require('../utils/ApiError');

const CPU_THRESHOLD = 70; // percent
const CHECK_INTERVAL = 5000; // 5 seconds

function monitorCPU() {
  setInterval(async () => {
    try {
      const stats = await pidusage(process.pid);
      const cpu = stats.cpu.toFixed(2);

      console.log(`Current CPU usage: ${cpu}%`);

      if (cpu > CPU_THRESHOLD) {
        console.log("CPU usage crossed threshold. Restarting server...");

        // Graceful restart (for dev: nodemon || prod: pm2)
        exec('npm restart', (error, stdout, stderr) => {
          if (error) {
            console.error(`Restart failed: ${error.message}`);
            return;
          }
          console.log(`Server restarted:\n${stdout}`);
        });
      }
    } catch (err) {
      throw new ApiError(500, err?.message ||  `Failed to monitor CPU: ${err.message}`);
    }
  }, CHECK_INTERVAL);
}

module.exports = monitorCPU;
