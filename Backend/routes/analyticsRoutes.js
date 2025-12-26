import express from 'express';
const router = express.Router();
import { getAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

// GET analytics - authenticated users only
router.get('/', authenticateToken, getAnalytics);

export default router;

