const Cart = require('../models/Cart');
const logger = require('../utils/logger');

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Array of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       500:
 *         description: Server error
 */
const getCart = async (req, res) => {
  try {
    logger.info('🛒 Fetching all cart items');
    const items = await Cart.find().sort({ createdAt: -1 });
    logger.info(`✅ Cart has ${items.length} item(s)`);
    res.status(200).json(items);
  } catch (error) {
    logger.error(`❌ Failed to fetch cart: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching cart', error: error.message });
  }
};

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - title
 *               - price
 *             properties:
 *               productId:
 *                 type: number
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 default: 1
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       200:
 *         description: Cart item quantity updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
const addToCart = async (req, res) => {
  try {
    const { productId, title, price, image, category, quantity = 1 } = req.body;

    // Basic validation
    if (!productId || !title || price == null) {
      logger.warn('⚠️ Add to cart – missing required fields');
      return res.status(400).json({ message: 'productId, title, and price are required' });
    }

    logger.info(`🛒 Adding product ${productId} ("${title}") to cart, qty: ${quantity}`);

    // If item already in cart, increment quantity
    const existing = await Cart.findOne({ productId });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      logger.info(`✅ Cart item quantity updated: product ${productId} → qty ${existing.quantity}`);
      return res.status(200).json({
        message: `Cart updated – quantity is now ${existing.quantity}`,
        item: existing,
      });
    }

    // New cart item
    const cartItem = await Cart.create({ productId, title, price, image, category, quantity });
    logger.info(`✅ Product ${productId} added to cart successfully`);
    res.status(201).json({ message: 'Product added to cart successfully! 🛒', item: cartItem });
  } catch (error) {
    logger.error(`❌ Failed to add to cart: ${error.message}`);
    res.status(500).json({ message: 'Server error while adding to cart', error: error.message });
  }
};

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       404:
 *         description: Item not found in cart
 */
const removeFromCart = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    logger.info(`🗑️ Removing product ${productId} from cart`);

    const result = await Cart.findOneAndDelete({ productId });
    if (!result) {
      logger.warn(`⚠️ Product ${productId} not found in cart`);
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    logger.info(`✅ Product ${productId} removed from cart`);
    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    logger.error(`❌ Failed to remove from cart: ${error.message}`);
    res.status(500).json({ message: 'Server error while removing from cart', error: error.message });
  }
};

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared
 */
const clearCart = async (req, res) => {
  try {
    logger.info('🧹 Clearing entire cart');
    await Cart.deleteMany({});
    logger.info('✅ Cart cleared successfully');
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    logger.error(`❌ Failed to clear cart: ${error.message}`);
    res.status(500).json({ message: 'Server error while clearing cart', error: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
