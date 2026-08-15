const morgan = require('morgan');
const logger = require('../utils/logger');

/**
 * Morgan HTTP request logger middleware.
 * Streams Morgan output to Winston logger at 'http' level.
 */

// Create a stream that writes to Winston
const stream = {
  write: (message) => logger.info(message.trim(), { type: 'http' }),
};

// Morgan format: :method :url :status :response-time ms
const httpLogger = morgan(
  ':method :url :status :res[content-length] bytes - :response-time ms',
  { stream }
);

module.exports = httpLogger;
