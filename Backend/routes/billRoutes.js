import express from 'express';
const router = express.Router();
import billController from '../controllers/billController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

// GET routes - authenticated users only
// Order matters: specific routes before parameterized routes
router.get('/active/:tableNo', authenticateToken, billController.getActiveOrder);
router.get('/open', authenticateToken, billController.getOpenOrders);
router.get('/stats', authenticateToken, billController.getDailyStats);
router.get('/', authenticateToken, billController.getBills);
router.get('/:id', authenticateToken, billController.getBillById);

// POST routes - authenticated users only
router.post('/save', authenticateToken, billController.saveOrder);
router.post('/generate/:id', authenticateToken, billController.generateBill);
router.post('/settle/:id', authenticateToken, billController.settleBill);

// DELETE - Admin only
router.delete('/:id', authenticateToken, requireAdmin, billController.deleteBill);

export default router;
