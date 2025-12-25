const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET menu items - public (for billing page)
router.get('/', menuController.getAllMenuItems);

// POST, PUT, DELETE - Admin only
router.post('/', authenticateToken, requireAdmin, menuController.addMenuItem);
router.put('/:id', authenticateToken, requireAdmin, menuController.updateMenuItem);
router.delete('/:id', authenticateToken, requireAdmin, menuController.deleteMenuItem);

module.exports = router;
