const express = require('express');
const multer = require('multer');
const controller = require('../controllers/aiController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 6 * 1024 * 1024 } });

const router = express.Router();

router.post('/solve', upload.single('taskPhoto'), controller.solve);
router.post('/explain', express.json(), controller.explain);

module.exports = router;
