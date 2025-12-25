const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get all categories (admin)
router.get('/admin', authenticateToken, requireAdmin, categoryController.getAllCategoriesAdmin);

// Create category
router.post('/', authenticateToken, requireAdmin, categoryController.createCategory);

// Update category
router.put('/:id', authenticateToken, requireAdmin, categoryController.updateCategory);

// Delete category
router.delete('/:id', authenticateToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;