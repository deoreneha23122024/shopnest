/**
 * app.js – Express Application
 *
 * This file ONLY configures the Express app:
 *   - Middleware (CORS, JSON, logging)
 *   - Routes
 *   - Swagger docs
 *   - Global error handler
 *
 * It does NOT start the server or connect to MongoDB.
 * See index.js for server startup and DB connection.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const httpLogger = require('./middleware/logger');
const setupSwagger = require('./swagger/swagger');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────

// CORS – allow requests from the frontend (Vite dev server)
const allowedOrigins = [
  process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`🚫 CORS blocked request from origin: ${origin}`);
        callback(null, true); // In dev, allow all; tighten in production
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Parse incoming JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (Morgan → Winston)
app.use(httpLogger);

// ─── Swagger API Documentation ─────────────────────────────────────────────────
setupSwagger(app);

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
  logger.info('💚 Health check ping');
  res.json({
    status: 'OK',
    message: 'ShopNest API is running 🚀',
    docs: '/api-docs',
    endpoints: {
      products: 'GET /products',
      productsByCategory: 'GET /products/:category',
      productById: 'GET /products/id/:id',
      categories: 'GET /products/categories',
      getCart: 'GET /cart',
      addToCart: 'POST /api/cart',
      removeFromCart: 'DELETE /api/cart/:productId',
      clearCart: 'DELETE /api/cart',
      getWishlist: 'GET /favorites',
      addToWishlist: 'POST /api/favorites',
      removeFromWishlist: 'DELETE /api/favorites/:productId',
    },
  });
});

// ── Auth ──────────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// ── Products ──────────────────────────────────────────────────────────────────
app.use('/products', productRoutes);
app.use('/api/products', productRoutes);

// ── Cart ──────────────────────────────────────────────────────────────────────
app.use('/cart', cartRoutes);
app.use('/api/cart', cartRoutes);

// ── Wishlist / Favorites ──────────────────────────────────────────────────────
app.use('/favorites', wishlistRoutes);
app.use('/api/favorites', wishlistRoutes);

// ── Orders & Payments ────────────────────────────────────────────────────────
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  logger.warn(`⚠️ 404 – Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(`💥 Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
