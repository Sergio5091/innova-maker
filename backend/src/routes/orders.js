const express = require('express');
const router = express.Router();

// Import controllers
const {
  createOrder,
  getUserOrders,
  getUserOrderById,
  cancelOrder
} = require('../controllers/orderController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// All order routes require authentication
router.use(authenticateToken);

// Customer order routes
router.post('/', createOrder);              // POST / : Create order from cart
router.get('/', getUserOrders);             // GET / : Get user's orders
router.get('/:id', getUserOrderById);       // GET /:id : Get specific order details
router.patch('/:id/cancel', cancelOrder);   // PATCH /:id/cancel : Cancel order

module.exports = router;
