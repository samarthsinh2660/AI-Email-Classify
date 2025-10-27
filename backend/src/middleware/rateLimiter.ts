/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP
 */

import rateLimit from 'express-rate-limit';
import { sendError } from '../utils/response';
import logger from '../utils/logger';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    sendError(
      res,
      'Too many requests from this IP, please try again later',
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  },
  skip: (req) => {
    // Skip rate limiting for health check endpoint
    return req.path === '/health';
  }
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}`);
    sendError(
      res,
      'Too many authentication attempts, please try again later',
      429,
      'AUTH_RATE_LIMIT_EXCEEDED'
    );
  }
});

/**
 * Rate limiter for email fetching (more permissive)
 */
export const emailLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 email fetch requests per minute
  handler: (req, res) => {
    logger.warn(`Email fetch rate limit exceeded for IP: ${req.ip}`);
    sendError(
      res,
      'Too many email fetch requests, please try again later',
      429,
      'EMAIL_RATE_LIMIT_EXCEEDED'
    );
  }
});

/**
 * Rate limiter for classification endpoints
 */
export const classificationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 classification requests per minute
  handler: (req, res) => {
    logger.warn(`Classification rate limit exceeded for IP: ${req.ip}`);
    sendError(
      res,
      'Too many classification requests, please try again later',
      429,
      'CLASSIFICATION_RATE_LIMIT_EXCEEDED'
    );
  }
});
