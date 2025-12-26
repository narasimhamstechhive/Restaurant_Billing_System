import express from 'express';
const router = express.Router();
import analyticsController from '../controllers/analyticsController.js';
import { authenticateToken } from '../middleware/auth.js';

// GET analytics - authenticated users only
router.get('/', authenticateToken, analyticsController.getAnalytics);

export default router;

