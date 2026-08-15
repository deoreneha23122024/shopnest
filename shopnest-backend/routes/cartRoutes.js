const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartController');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

// GET  /cart          → Get all cart items
router.get('/', getCart);

// POST /api/cart      → Add item to cart
router.post('/', addToCart);

// DELETE /api/cart    → Clear entire cart
router.delete('/', clearCart);

// DELETE /api/cart/:productId → Remove specific item
router.delete('/:productId', removeFromCart);

module.exports = router;
