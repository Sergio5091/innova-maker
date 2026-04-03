const express = require('express');
const router = express.Router();

// Import controllers
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartSummary
} = require('../controllers/cartController');

// Import middleware
const { authenticateToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(authenticateToken);

// Cart routes
router.get('/', getCart);                    // GET / : Get user's cart
router.get('/summary', getCartSummary);      // GET /summary : Get cart summary
router.post('/add', addToCart);              // POST /add : Add item to cart
router.put('/update', updateCartItem);       // PUT /update : Update cart item quantity
router.delete('/:product_id', removeFromCart); // DELETE /:product_id : Remove item from cart
router.delete('/', clearCart);               // DELETE / : Clear entire cart

module.exports = router;
