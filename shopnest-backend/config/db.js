const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connect to MongoDB using the URI from environment variables.
 * Logs success or failure using Winston logger.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host} | DB: ${conn.connection.name}`);
  } catch (error) {
    logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
