const Product = require('../models/Product');
const logger = require('../utils/logger');

// ─── PUBLIC ENDPOINTS ─────────────────────────────────────────────────────────

/** GET /products — All products */
const getAllProducts = async (req, res) => {
  try {
    const { limit } = req.query;
    let query = Product.find().sort({ createdAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const products = await query;
    logger.info(`📦 Returned ${products.length} products`);
    res.status(200).json(products);
  } catch (err) {
    logger.error(`❌ getAllProducts: ${err.message}`);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/** GET /products/categories — Distinct categories */
const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories.sort());
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/** GET /products/id/:id — Single product by numeric ID */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: `Product ${req.params.id} not found` });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/** GET /products/category/:category — Filter by category */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category: category.toLowerCase() }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ─── SELLER ENDPOINTS (protected) ────────────────────────────────────────────

/** GET /api/products/my-products — Seller's own products */
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    logger.info(`🏪 Seller ${req.user.email} has ${products.length} products`);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/** POST /api/products — Seller adds a product */
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, stock } = req.body;
    if (!title || !price || !category)
      return res.status(400).json({ message: 'Title, price, and category are required' });

    const product = await Product.create({
      title,
      description: description || '',
      price: Number(price),
      category: category.toLowerCase(),
      image: image || 'https://via.placeholder.com/300x300?text=Product',
      stock: Number(stock) || 100,
      sellerId: req.user._id,
      sellerName: req.user.name,
      storeName: req.user.storeName || 'ShopNest Store',
      rating: { rate: 0, count: 0 },
    });

    logger.info(`✅ Seller ${req.user.email} added product: "${title}"`);
    res.status(201).json({ message: 'Product listed successfully! 🎉', product });
  } catch (err) {
    logger.error(`❌ createProduct: ${err.message}`);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/** PUT /api/products/:id — Seller updates own product */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (String(product.sellerId) !== String(req.user._id))
      return res.status(403).json({ message: 'You can only edit your own products' });

    const allowed = ['title', 'description', 'price', 'category', 'image', 'stock'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });
    await product.save();

    logger.info(`✏️ Product ${product.id} updated by ${req.user.email}`);
    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
    logger.error(`❌ updateProduct: ${err.message}`);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/** DELETE /api/products/:id — Seller deletes own product */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: Number(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (String(product.sellerId) !== String(req.user._id))
      return res.status(403).json({ message: 'You can only delete your own products' });

    await product.deleteOne();
    logger.info(`🗑️ Product ${product.id} deleted by ${req.user.email}`);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    logger.error(`❌ deleteProduct: ${err.message}`);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllProducts, getCategories, getProductById,
  getProductsByCategory, getMyProducts,
  createProduct, updateProduct, deleteProduct,
};
