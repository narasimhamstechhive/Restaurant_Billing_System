const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// GET analytics - authenticated users only
router.get('/', authenticateToken, analyticsController.getAnalytics);

module.exports = router;

