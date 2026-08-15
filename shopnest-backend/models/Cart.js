const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
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
 *         quantity:
 *           type: number
 *           default: 1
 *         addedAt:
 *           type: string
 *           format: date-time
 */
const cartSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
    category: { type: String, default: '' },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
