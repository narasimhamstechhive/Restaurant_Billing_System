import express from 'express';
const router = express.Router();
import { login, logout, createAdmin, setupAdmin } from '../controllers/authController.js';
import { authenticateToken, requireAdmin, optionalAuthenticateToken } from '../middleware/auth.js';

// Public routes
router.post('/login', login);

// Protected routes
router.post('/logout', authenticateToken, logout);

// Admin routes (public if no admin exists, protected if admins exist)
// Uses optional auth middleware so token is verified if provided, but not required
router.post('/admin/create', optionalAuthenticateToken, createAdmin);

// Setup route (public, but only works if no admin exists)
router.post('/admin/setup', setupAdmin);

export default router;
