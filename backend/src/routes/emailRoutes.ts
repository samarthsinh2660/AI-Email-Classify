/**
 * Email Routes
 */

import { Router } from 'express';
import {
  getEmails,
  classifyEmailsHandler,
  fetchAndClassify
} from '../controllers/emailController';
import { verifyAuth } from '../middleware/auth';
import { emailLimiter, classificationLimiter } from '../middleware/rateLimiter';

const router = Router();

/**
 * @route   GET /api/emails
 * @desc    Fetch emails from Gmail
 * @access  Protected
 * @query   limit - Number of emails to fetch (default: 15, max: 50)
 */
router.get('/', verifyAuth, emailLimiter, getEmails);

/**
 * @route   POST /api/emails/classify
 * @desc    Classify emails using OpenAI
 * @access  Protected
 * @body    emails - Array of email objects, openaiApiKey - OpenAI API key
 */
router.post('/classify', verifyAuth, classificationLimiter, classifyEmailsHandler);

/**
 * @route   POST /api/emails/fetch-and-classify
 * @desc    Fetch emails from Gmail and classify them in one request
 * @access  Protected
 * @body    openaiApiKey - OpenAI API key
 * @query   limit - Number of emails to fetch (default: 15, max: 50)
 */
router.post('/fetch-and-classify', verifyAuth, emailLimiter, fetchAndClassify);

export default router;
