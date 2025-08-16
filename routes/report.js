const express = require('express');
const router = express.Router();
const multer = require('multer');
const reportController = require('../controllers/reportController');
const verifyApiKey = require('../middleware/verifyApiKey');

// Multer config for large file uploads (up to 20GB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 * 1024 }, // 20GB
});

// Upload Playwright JSON to DynamoDB
router.post('/json', verifyApiKey, reportController.uploadJson);

// Upload Playwright ZIP to S3
router.post('/zip', verifyApiKey, upload.single('file'), reportController.uploadZip);

// Get executions API (alias for getReports)
router.get("/executions", reportController.getExecutions);

module.exports = router;
