const express = require("express");
const router = express.Router();
const { uploadFileController } = require("../controllers/upload.controller");
const upload = require("../middlewares/multer.middleware");

router.post("/", upload.single("file"), uploadFileController);

module.exports = router;
