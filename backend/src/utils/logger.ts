/**
 * Winston Logger Configuration
 * Provides structured logging with different levels and transports
 */

import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, ...metadata }) => {
  let log = `${timestamp} [${level}]: ${message}`;
  
  // Add stack trace for errors
  if (stack) {
    log += `\n${stack}`;
  }
  
  // Add metadata if present
  if (Object.keys(metadata).length > 0) {
    log += `\n${JSON.stringify(metadata, null, 2)}`;
  }
  
  return log;
});

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    // Console transport with colors for development
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    // File transport for info and above
    new winston.transports.File({
      filename: path.join('logs', 'info.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // File transport for warnings and above
    new winston.transports.File({
      filename: path.join('logs', 'warn.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // File transport for errors only
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'error.log')
    }),
    new winston.transports.File({
      filename: path.join('logs', 'warn.log')
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join('logs', 'error.log')
    }),
    new winston.transports.File({
      filename: path.join('logs', 'warn.log')
    })
  ]
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

export default logger;
