/**
 * index.js – Server Entry Point
 *
 * Responsibilities:
 *   1. Load environment variables
 *   2. Connect to MongoDB
 *   3. Start the Express HTTP server
 *
 * This file does NOT define any routes or middleware.
 * All request handling lives in app.js.
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 8080;

// Connect to MongoDB first, then start the server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    logger.info('═══════════════════════════════════════════════');
    logger.info(`🚀 ShopNest Backend is running`);
    logger.info(`📡 Port        : ${PORT}`);
    logger.info(`🌍 Environment : ${process.env.NODE_ENV || 'development'}`);
    logger.info(`📖 API Docs    : http://localhost:${PORT}/api-docs`);
    logger.info(`💚 Health Check: http://localhost:${PORT}/`);
    logger.info('═══════════════════════════════════════════════');
  });

  // Graceful shutdown
  const gracefulShutdown = (signal) => {
    logger.info(`🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      logger.info('✅ HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`💥 Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });
};

startServer();
