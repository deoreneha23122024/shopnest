const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     WishlistItem:
 *       type: object
 *       required:
 *         - productId
 *       properties:
 *         _id:
 *           type: string
 *         productId:
 *           type: number
 *           description: Numeric product ID
 *         title:
 *           type: string
 *         price:
 *           type: number
 *         image:
 *           type: string
 *         category:
 *           type: string
 *         rating:
 *           type: object
 *           properties:
 *             rate:
 *               type: number
 *             count:
 *               type: number
 *         addedAt:
 *           type: string
 *           format: date-time
 */
const wishlistSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wishlist', wishlistSchema);
