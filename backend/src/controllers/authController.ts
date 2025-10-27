/**
 * Authentication Controller
 * Handles Google OAuth authentication flow
 */

import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis';
import { sendSuccess } from '../utils/response';
import { ERRORS } from '../utils/error';
import logger from '../utils/logger';

/**
 * Get Google OAuth URL
 */
export const getAuthUrl = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const host = req.get('host');
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${host}`
      : `http://${host}`;

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/gmail.readonly'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    });

    logger.info('Generated OAuth URL');
    sendSuccess(res, { authUrl: url }, 'OAuth URL generated successfully');
  } catch (error) {
    logger.error('Error generating auth URL:', error);
    next(error);
  }
};

/**
 * Handle Google OAuth callback
 */
export const handleCallback = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      throw ERRORS.INVALID_OAUTH_CODE;
    }

    // Use dynamic redirect URI based on request host
    const host = req.get('host');
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${host}`
      : `http://${host}`;

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    logger.info(`User authenticated: ${userInfo.data.email}`);

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?access_token=${tokens.access_token}&refresh_token=${tokens.refresh_token || ''}&email=${userInfo.data.email}&name=${userInfo.data.name}`;

    res.redirect(redirectUrl);
  } catch (error) {
    logger.error('Error in OAuth callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth?error=authentication_failed`);
  }
};

/**
 * Verify token endpoint
 */
export const verifyToken = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    // If we reach here, the auth middleware has already verified the token
    sendSuccess(
      res,
      {
        user: req.user
      },
      'Token is valid'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token
 */
export const refreshToken = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw ERRORS.INVALID_REFRESH_TOKEN;
    }

    // Use dynamic redirect URI based on request host
    const host = req.get('host');
    const baseUrl = process.env.NODE_ENV === 'production'
      ? `https://${host}`
      : `http://${host}`;

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    // Get new access token
    const { credentials } = await oauth2Client.refreshAccessToken();

    logger.info('Access token refreshed');
    sendSuccess(
      res,
      {
        accessToken: credentials.access_token,
        expiresIn: credentials.expiry_date
      },
      'Token refreshed successfully'
    );
  } catch (error) {
    logger.error('Error refreshing token:', error);
    next(error);
  }
};
