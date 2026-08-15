const Wishlist = require('../models/Wishlist');
const logger = require('../utils/logger');

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get all wishlist/favorites items
 *     tags: [Wishlist]
 *     responses:
 *       200:
 *         description: Array of wishlist items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WishlistItem'
 *       500:
 *         description: Server error
 */
const getWishlist = async (req, res) => {
  try {
    logger.info('❤️ Fetching all wishlist items');
    const items = await Wishlist.find().sort({ createdAt: -1 });
    logger.info(`✅ Wishlist has ${items.length} item(s)`);
    res.status(200).json(items);
  } catch (error) {
    logger.error(`❌ Failed to fetch wishlist: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching wishlist', error: error.message });
  }
};

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Add a product to the wishlist / favorites
 *     tags: [Wishlist]
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
 *               rating:
 *                 type: object
 *                 properties:
 *                   rate:
 *                     type: number
 *                   count:
 *                     type: number
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       200:
 *         description: Already in wishlist
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId, title, price, image, category, rating } = req.body;

    if (!productId || !title || price == null) {
      logger.warn('⚠️ Add to wishlist – missing required fields');
      return res.status(400).json({ message: 'productId, title, and price are required' });
    }

    logger.info(`❤️ Adding product ${productId} ("${title}") to wishlist`);

    // Upsert – don't duplicate
    const existing = await Wishlist.findOne({ productId });
    if (existing) {
      logger.info(`ℹ️ Product ${productId} already in wishlist`);
      return res.status(200).json({ message: 'Product is already in your wishlist ❤️', item: existing });
    }

    const wishlistItem = await Wishlist.create({ productId, title, price, image, category, rating });
    logger.info(`✅ Product ${productId} added to wishlist`);
    res.status(201).json({ message: 'Product added to wishlist successfully! ❤️', item: wishlistItem });
  } catch (error) {
    logger.error(`❌ Failed to add to wishlist: ${error.message}`);
    res.status(500).json({ message: 'Server error while adding to wishlist', error: error.message });
  }
};

/**
 * @swagger
 * /api/favorites/{productId}:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from wishlist
 *       404:
 *         description: Item not found in wishlist
 */
const removeFromWishlist = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    logger.info(`🗑️ Removing product ${productId} from wishlist`);

    const result = await Wishlist.findOneAndDelete({ productId });
    if (!result) {
      logger.warn(`⚠️ Product ${productId} not found in wishlist`);
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    logger.info(`✅ Product ${productId} removed from wishlist`);
    res.status(200).json({ message: 'Item removed from wishlist successfully' });
  } catch (error) {
    logger.error(`❌ Failed to remove from wishlist: ${error.message}`);
    res.status(500).json({ message: 'Server error while removing from wishlist', error: error.message });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
