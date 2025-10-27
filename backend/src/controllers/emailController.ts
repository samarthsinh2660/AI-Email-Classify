/**
 * Email Controller
 * Handles email fetching and classification
 */

import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { ERRORS } from '../utils/error';
import { fetchEmails } from '../services/gmailService';
import { classifyEmails, getClassificationStats } from '../services/classificationService';
import logger from '../utils/logger';

/**
 * Fetch emails from Gmail
 */
export const getEmails = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const maxResults = parseInt(req.query.limit as string) || 15;

    if (maxResults < 1 || maxResults > 50) {
      throw ERRORS.INVALID_EMAIL_LIMIT;
    }

    const accessToken = req.user!.accessToken;
    const emails = await fetchEmails(accessToken, maxResults);

    logger.info(`Fetched ${emails.length} emails for user ${req.user!.email}`);
    sendSuccess(
      res,
      {
        emails,
        count: emails.length
      },
      'Emails fetched successfully'
    );
  } catch (error) {
    logger.error('Error fetching emails:', error);
    next(error);
  }
};

/**
 * Classify emails
 */
export const classifyEmailsHandler = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { emails, apiKey, provider = 'openai' } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      throw ERRORS.INVALID_EMAIL_DATA;
    }

    if (!apiKey || typeof apiKey !== 'string') {
      throw provider === 'openai' ? ERRORS.INVALID_OPENAI_KEY : ERRORS.INVALID_GEMINI_KEY;
    }

    if (!['openai', 'gemini'].includes(provider)) {
      throw ERRORS.INVALID_PARAMS;
    }

    logger.info(`Classifying ${emails.length} emails using ${provider.toUpperCase()} for user ${req.user?.email || 'unknown'}`);
    const classifiedEmails = await classifyEmails(emails, apiKey, provider);
    const stats = getClassificationStats(classifiedEmails);

    sendSuccess(
      res,
      {
        classifiedEmails,
        stats,
        count: classifiedEmails.length,
        provider
      },
      `Emails classified successfully using ${provider.toUpperCase()}`
    );
  } catch (error) {
    logger.error('Error classifying emails:', error);
    next(error);
  }
};

/**
 * Fetch and classify emails in one request
 */
export const fetchAndClassify = async (req: Request,res: Response,next: NextFunction): Promise<void> => {
  try {
    const { apiKey, provider = 'openai' } = req.body;
    const maxResults = parseInt(req.query.limit as string) || 15;

    if (!apiKey || typeof apiKey !== 'string') {
      throw provider === 'openai' ? ERRORS.INVALID_OPENAI_KEY : ERRORS.INVALID_GEMINI_KEY;
    }

    if (!['openai', 'gemini'].includes(provider)) {
      throw ERRORS.INVALID_PARAMS;
    }

    if (maxResults < 1 || maxResults > 50) {
      throw ERRORS.INVALID_EMAIL_LIMIT;
    }

    const accessToken = req.user!.accessToken;

    // Fetch emails
    logger.info(`Fetching and classifying ${maxResults} emails for user ${req.user!.email} using ${provider.toUpperCase()}`);
    const emails = await fetchEmails(accessToken, maxResults);

    if (emails.length === 0) {
      sendSuccess(
        res,
        {
          classifiedEmails: [],
          stats: {},
          provider
        },
        'No emails found'
      );
      return;
    }

    // Classify emails
    const classifiedEmails = await classifyEmails(emails, apiKey, provider);
    const stats = getClassificationStats(classifiedEmails);

    sendSuccess(
      res,
      {
        classifiedEmails,
        stats,
        count: classifiedEmails.length,
        provider
      },
      `Emails fetched and classified successfully using ${provider.toUpperCase()}`
    );
  } catch (error) {
    logger.error('Error in fetch and classify:', error);
    next(error);
  }
};
