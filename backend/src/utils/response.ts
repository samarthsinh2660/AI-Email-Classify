/**
 * Standardized API Response Utilities
 * Provides consistent response format across all endpoints
 */

import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  timestamp: string;
}

/**
 * Send success response
 */
export const sendSuccess = <T = unknown>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errorCode?: string,
  details?: unknown
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    error: {
      code: errorCode || `ERROR_${statusCode}`,
      details
    },
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 */
export const sendPaginated = <T = unknown>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): Response => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    },
    timestamp: new Date().toISOString()
  };

  return res.status(200).json(response);
};

/**
 * Response status helpers
 */
export const ResponseStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
} as const;
