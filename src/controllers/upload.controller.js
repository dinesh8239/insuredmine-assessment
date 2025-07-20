const { Worker } = require("worker_threads");
const path = require("path");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

exports.uploadFileController = asyncHandler(async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) throw new ApiError(400, "File path not found");

    const workerScript = path.resolve(__dirname, "../workers/csvWorker.js");

    const worker = new Worker(workerScript, {
      workerData: { filePath },
    });

    worker.on("message", (msg) => {
      console.log("Worker result:", msg);
    });

    worker.on("error", (err) => {
      console.error("Worker Error:", err);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.warn(`Worker exited with code ${code}`);
      } else {
        console.log("Worker exited successfully");
      }
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "File uploaded and processing started"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while processing file"
    );
  }
});

