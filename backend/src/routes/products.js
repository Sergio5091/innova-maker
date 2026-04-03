const express = require('express');
const router = express.Router();

// Import controllers
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
  updateProductStock
} = require('../controllers/productController');

// Import middleware
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

// Public routes (accessible to everyone)
router.get('/', optionalAuth, getProducts);
router.get('/stats', authenticateToken, requireAdmin, getProductStats);
router.get('/:id', optionalAuth, getProductById);

// Admin only routes (require authentication + admin role)
router.post('/', authenticateToken, requireAdmin, createProduct);
router.put('/:id', authenticateToken, requireAdmin, updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);
router.put('/:id/stock', authenticateToken, requireAdmin, updateProductStock);

module.exports = router;
