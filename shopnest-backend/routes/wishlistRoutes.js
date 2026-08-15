const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlistController');

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist / Favorites management
 */

// GET  /favorites             → Get all wishlist items
router.get('/', getWishlist);

// POST /api/favorites         → Add item to wishlist
router.post('/', addToWishlist);

// DELETE /api/favorites/:id  → Remove specific item
router.delete('/:productId', removeFromWishlist);

module.exports = router;
