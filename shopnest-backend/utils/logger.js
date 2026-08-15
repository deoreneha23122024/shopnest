const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Winston Logger Configuration
 * - Console: colorized, human-readable
 * - File (combined.log): all logs in JSON
 * - File (error.log): only error-level logs
 */
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'shopnest-backend' },
  transports: [
    // Write all logs to combined.log
    new transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 3,
    }),
    // Write error-level logs to error.log
    new transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
    }),
  ],
});

// In development, also log to console with colors
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length && meta.service !== 'shopnest-backend'
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `[${timestamp}] ${level}: ${message}${metaStr}`;
        })
      ),
    })
  );
}

module.exports = logger;
