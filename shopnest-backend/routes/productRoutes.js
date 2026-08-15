const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getCategories,
  getProductsByCategory,
  getProductById,
} = require('../controllers/productController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

// GET /products           → All products
router.get('/', getAllProducts);

// GET /products/categories → All distinct categories (must come BEFORE /:category)
router.get('/categories', getCategories);

// GET /products/id/:id    → Single product by numeric ID
router.get('/id/:id', getProductById);

// GET /products/:category → Products filtered by category
router.get('/:category', getProductsByCategory);

module.exports = router;
