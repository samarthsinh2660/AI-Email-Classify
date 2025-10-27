/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */

import { Request, Response, NextFunction } from 'express';
import { RequestError } from '../utils/error';
import { sendError } from '../utils/response';
import logger from '../utils/logger';

/**
 * Error handler middleware
 * Must have 4 parameters to be recognized as error handler by Express
 */
export const errorHandler = (
  err: Error | RequestError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    sendError(res, 'Validation Error', 400, 'VALIDATION_ERROR', err.message);
    return;
  }

  if (err.name === 'UnauthorizedError') {
    sendError(res, 'Invalid token', 401, 'UNAUTHORIZED');
    return;
  }

  if (err.name === 'CastError') {
    sendError(res, 'Invalid ID format', 400, 'CAST_ERROR');
    return;
  }

  // Handle syntax errors (e.g., invalid JSON)
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'Invalid JSON payload', 400, 'SYNTAX_ERROR');
    return;
  }

  // Handle our custom RequestError with proper status code and error code
  if (err instanceof RequestError) {
    sendError(
      res,
      err.message,
      err.statusCode,
      `ERROR_${err.code}`,
      process.env.NODE_ENV === 'production' ? undefined : err.stack
    );
    return;
  }

  // Default to 500 server error for unknown errors
  logger.error('Unhandled error:', err);
  sendError(
    res,
    process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message,
    500,
    'INTERNAL_SERVER_ERROR',
    process.env.NODE_ENV === 'production' ? undefined : err.stack
  );
};

/**
 * Handle 404 errors for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  sendError(
    res,
    `Cannot ${req.method} ${req.path}`,
    404,
    'ROUTE_NOT_FOUND'
  );
};

/**
 * Async handler wrapper to catch async errors
 * Usage: asyncHandler(async (req, res, next) => { ... })
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
