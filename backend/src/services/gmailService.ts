/**
 * Gmail Service
 * Handles fetching emails from Gmail API
 */

import { google } from 'googleapis';
import { ERRORS } from '../utils/error';
import logger from '../utils/logger';

export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  labels: string[];
}

/**
 * Create OAuth2 client with access token
 */
const createOAuth2Client = (accessToken: string) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return oauth2Client;
};

/**
 * Decode HTML entities in text (without base64 decoding)
 */
const decodeHtmlEntities = (text: string): string => {
  if (!text) return '';

  // Decode common HTML entities
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#34;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (match: string, dec: string): string => {
      const codePoint = parseInt(dec, 10);
      return String.fromCharCode(codePoint);
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (match: string, hex: string): string => {
      const codePoint = parseInt(hex, 16);
      return String.fromCharCode(codePoint);
    });
};
const decodeEmailBody = (encodedBody: string): string => {
  try {
    const buff = Buffer.from(encodedBody, 'base64');
    let decoded = buff.toString('utf-8');
    
    // Decode common HTML entities
    decoded = decoded
      .replace(/&quot;/g, '"')
      .replace(/&#34;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ');

    // Handle numeric character references
    decoded = decoded.replace(/&#(\d+);/g, (match: string, dec: string): string => {
      const codePoint = parseInt(dec, 10);
      return String.fromCharCode(codePoint);
    });

    // Handle hexadecimal character references
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match: string, hex: string): string => {
      const codePoint = parseInt(hex, 16);
      return String.fromCharCode(codePoint);
    });
    
    return decoded;
  } catch (error) {
    logger.error('Error decoding email body:', error);
    return '';
  }
};

/**
 * Extract email body from message parts
 */
const extractEmailBody = (parts: any[]): string => {
  let htmlBody = '';
  let plainBody = '';

  for (const part of parts) {
    if (part.mimeType === 'text/html' && part.body.data) {
      // Prefer HTML content
      htmlBody += decodeEmailBody(part.body.data);
    } else if (part.mimeType === 'text/plain' && part.body.data) {
      plainBody += decodeEmailBody(part.body.data);
    } else if (part.parts) {
      // Recursively check nested parts
      const nestedBody = extractEmailBody(part.parts);
      if (nestedBody) {
        // Check if nested body contains HTML
        if (nestedBody.includes('<html') || nestedBody.includes('<body')) {
          htmlBody += nestedBody;
        } else {
          plainBody += nestedBody;
        }
      }
    }
  }

  // Return HTML if available, otherwise plain text
  return htmlBody || plainBody;
};

/**
 * Parse email message from Gmail API response
 */
const parseEmailMessage = (message: any): EmailMessage => {
  const headers = message.payload.headers;
  
  const getHeader = (name: string): string => {
    const header = headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : '';
  };

  let body = '';
  if (message.payload.parts) {
    body = extractEmailBody(message.payload.parts);
  } else if (message.payload.body.data) {
    body = decodeEmailBody(message.payload.body.data);
  }

  // Keep full body for display, limit only for classification if needed
  // Classification service will handle truncation if necessary

  return {
    id: message.id,
    threadId: message.threadId,
    from: getHeader('From'),
    to: getHeader('To'),
    subject: decodeHtmlEntities(getHeader('Subject')), // Decode HTML entities in subject
    snippet: decodeHtmlEntities(message.snippet || ''), // Decode HTML entities in snippet
    body,
    date: getHeader('Date'),
    labels: message.labelIds || []
  };
};

/**
 * Fetch emails from Gmail
 */
export const fetchEmails = async (
  accessToken: string,
  maxResults: number = 15
): Promise<EmailMessage[]> => {
  try {
    logger.info(`Fetching ${maxResults} emails from Gmail`);

    const oauth2Client = createOAuth2Client(accessToken);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // List messages
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults,
      q: 'in:inbox' // Only fetch inbox messages
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) {
      logger.info('No messages found');
      return [];
    }

    // Fetch full message details
    const emailPromises = messages.map(async (message) => {
      const fullMessage = await gmail.users.messages.get({
        userId: 'me',
        id: message.id!,
        format: 'full'
      });

      return parseEmailMessage(fullMessage.data);
    });

    const emails = await Promise.all(emailPromises);
    logger.info(`Successfully fetched ${emails.length} emails`);

    return emails;
  } catch (error: any) {
    logger.error('Error fetching emails:', error);
    
    if (error.code === 401) {
      throw ERRORS.INVALID_AUTH_TOKEN;
    }
    
    throw ERRORS.EMAIL_FETCH_FAILED;
  }
};

/**
 * Get user profile from Gmail
 */
export const getUserProfile = async (accessToken: string): Promise<any> => {
  try {
    const oauth2Client = createOAuth2Client(accessToken);
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const profile = await gmail.users.getProfile({
      userId: 'me'
    });

    return profile.data;
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    throw ERRORS.GMAIL_API_ERROR;
  }
};
