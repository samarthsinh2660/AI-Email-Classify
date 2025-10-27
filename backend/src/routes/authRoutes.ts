/**
 * Authentication Routes
 */

import { Router } from 'express';
import {
  getAuthUrl,
  handleCallback,
  verifyToken,
  refreshToken
} from '../controllers/authController';
import { verifyAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   GET /api/auth/google
 * @desc    Get Google OAuth URL
 * @access  Public
 */
router.get('/google', authLimiter, getAuthUrl);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Handle Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', authLimiter, handleCallback);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify authentication token
 * @access  Protected
 */
router.get('/verify', verifyAuth, verifyToken);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authLimiter, refreshToken);

export default router;
