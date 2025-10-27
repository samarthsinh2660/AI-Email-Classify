/**
 * Authentication Middleware
 * Validates OAuth tokens and protects routes
 */

import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { ERRORS } from '../utils/error';
import logger from '../utils/logger';

// Extend Express Request type to include user
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: {
        email: string;
        name: string;
        picture?: string;
        accessToken: string;
        refreshToken?: string;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

/**
 * Verify Google OAuth token
 */
export const verifyAuth = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ERRORS.NO_TOKEN_PROVIDED;
    }

    const accessToken = authHeader.split(' ')[1];

    if (!accessToken) {
      throw ERRORS.INVALID_AUTH_TOKEN;
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      access_token: accessToken
    });

    // Verify token by getting user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    if (!userInfo.data || !userInfo.data.email) {
      throw ERRORS.INVALID_AUTH_TOKEN;
    }

    // Attach user info to request
    req.user = {
      email: userInfo.data.email,
      name: userInfo.data.name || '',
      picture: userInfo.data.picture || undefined,
      accessToken
    };

    logger.info(`User authenticated: ${req.user.email}`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    next(error);
  }
};

/**
 * Optional auth middleware - doesn't fail if no token
 */
export const optionalAuth = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      await verifyAuth(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    // Silently continue without auth
    next();
  }
};
