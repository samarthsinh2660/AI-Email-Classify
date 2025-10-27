/**
 * Email Classification Service
 * Uses OpenAI GPT or Google Gemini to classify emails into categories
 */

import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';
import { ERRORS} from '../utils/error';
import { EmailMessage } from './gmailService';

export type EmailCategory = 'Important' | 'Promotional' | 'Social' | 'Marketing' | 'Spam' | 'General';

export interface ClassifiedEmail extends EmailMessage {
  category: EmailCategory;
  confidence?: number;
}

/**
 * Improved Classification prompt template
 * More detailed and accurate categorization
 */
const CLASSIFICATION_PROMPT = `You are an expert email classification assistant. Analyze the email content and classify it into ONE of the following categories based on the sender, subject, content, and context:

CATEGORY DEFINITIONS:
- IMPORTANT: High-priority emails requiring immediate attention including:
  * Work-related communications (meetings, deadlines, urgent requests)
  * Personal urgent matters (health, family emergencies, time-sensitive personal issues)
  * Account security notifications, password resets, verification codes
  * Time-sensitive opportunities or deadlines
  * Direct communications from key contacts

- PROMOTIONAL: Commercial advertising and sales including:
  * Product sales, discounts, coupons, special offers
  * E-commerce promotions, flash sales, limited-time deals
  * Retail marketing, store promotions, shopping deals
  * Commercial advertisements, sponsorships

- SOCIAL: Personal and social communications including:
  * Messages from friends, family, acquaintances
  * Social media notifications, friend requests, group invites
  * Personal event invitations, birthday reminders
  * Social networking updates, comments, likes
  * Personal blogs, forums, community discussions

- MARKETING: Business communications and newsletters including:
  * Company newsletters, product updates, announcements
  * Industry news, market updates, business insights
  * Educational content, webinars, tutorials
  * Service updates, maintenance notifications
  * Subscription-based content, magazines, journals

- SPAM: Unsolicited, unwanted, or potentially harmful content including:
  * Unrequested commercial emails, scams, phishing attempts
  * Lottery wins, suspicious offers, fraudulent schemes
  * Unsolicited job offers, suspicious investment opportunities
  * Malware links, suspicious attachments
  * Excessive promotional content that appears unwanted

- GENERAL: Routine or miscellaneous communications including:
  * System notifications, receipts, confirmations
  * Routine updates, status reports, automated messages
  * Generic announcements, community updates
  * Informational content that doesn't fit other categories
  * Low-priority administrative communications

CLASSIFICATION RULES:
1. Choose ONLY ONE category that best fits the email
2. Consider the sender's identity and relationship to you
3. Evaluate the subject line and content priority
4. Look for commercial intent vs personal/social context
5. Default to GENERAL if unsure, never make up categories

EMAIL ANALYSIS:
From: {from}
Subject: {subject}
Snippet: {snippet}
Body: {body}

Respond with ONLY the category name in uppercase (IMPORTANT, PROMOTIONAL, SOCIAL, MARKETING, SPAM, or GENERAL). Do not include any explanation, punctuation, or additional text.`;

/**
 * Classify a single email using OpenAI
 */
const classifySingleEmail = async (
  email: EmailMessage,
  openaiApiKey: string
): Promise<ClassifiedEmail> => {
  try {
    const model = new ChatOpenAI({
      openAIApiKey: openaiApiKey,
      modelName: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 10
    });

    const promptTemplate = PromptTemplate.fromTemplate(CLASSIFICATION_PROMPT);
    const outputParser = new StringOutputParser();

    const chain = promptTemplate.pipe(model).pipe(outputParser);

    // Limit body to 1500 characters for AI classification to save tokens
    const truncatedBody = email.body.substring(0, 1500);

    const result = await chain.invoke({
      from: email.from,
      subject: email.subject,
      snippet: email.snippet,
      body: truncatedBody
    });

    // Clean and validate the result
    const rawCategory = result.trim().toUpperCase();
    
    // Map uppercase to title case
    const categoryMap: Record<string, EmailCategory> = {
      'IMPORTANT': 'Important',
      'PROMOTIONAL': 'Promotional',
      'SOCIAL': 'Social',
      'MARKETING': 'Marketing',
      'SPAM': 'Spam',
      'GENERAL': 'General'
    };

    const category = categoryMap[rawCategory] || 'General';

    if (category === 'General' && rawCategory !== 'GENERAL') {
      logger.warn(`Invalid category returned: ${rawCategory}, defaulting to General`);
    }

    return {
      ...email,
      category
    };
  } catch (error: any) {
    logger.error(`Error classifying email ${email.id}:`, error);

    // Check for API key errors
    if (error?.status === 401 || error?.code === 'invalid_api_key') {
      // Check if this might be a key type mismatch
      if (openaiApiKey.startsWith('AIzaSy')) {
        throw ERRORS.OPENAI_KEY_TYPE_MISMATCH;
      }
      throw ERRORS.INVALID_OPENAI_KEY;
    }

    // Check for other OpenAI errors
    if (error?.status === 429) {
      throw ERRORS.OPENAI_RATE_LIMIT;
    }

    if (error?.status >= 500) {
      throw ERRORS.OPENAI_API_ERROR;
    }

    // Return as General if classification fails for other reasons
    return {
      ...email,
      category: 'General'
    };
  }
};

/**
 * Classify a single email using Google Gemini
 */
const classifySingleEmailGemini = async (
  email: EmailMessage,
  geminiApiKey: string
): Promise<ClassifiedEmail> => {
  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model:'gemini-2.0-flash' });

    // Limit body to 1500 characters for AI classification to save tokens
    const truncatedBody = email.body.substring(0, 1500);

    const prompt = CLASSIFICATION_PROMPT
      .replace('{from}', email.from)
      .replace('{subject}', email.subject)
      .replace('{snippet}', email.snippet)
      .replace('{body}', truncatedBody);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawCategory = response.text().trim().toUpperCase();

    // Map uppercase to title case
    const categoryMap: Record<string, EmailCategory> = {
      'IMPORTANT': 'Important',
      'PROMOTIONAL': 'Promotional',
      'SOCIAL': 'Social',
      'MARKETING': 'Marketing',
      'SPAM': 'Spam',
      'GENERAL': 'General'
    };

    const category = categoryMap[rawCategory] || 'General';

    if (category === 'General' && rawCategory !== 'GENERAL') {
      logger.warn(`Invalid category returned by Gemini: ${rawCategory}, defaulting to General`);
    }

    return {
      ...email,
      category
    };
  } catch (error: any) {
    logger.error(`Error classifying email ${email.id} with Gemini:`, error);

    // Check for API key errors
    if (error?.status === 401 || error?.code === 'invalid_api_key' || error?.message?.includes('API key')) {
      // Check if this might be a key type mismatch
      if (!geminiApiKey.startsWith('AIzaSy')) {
        throw ERRORS.GEMINI_KEY_TYPE_MISMATCH;
      }
      throw ERRORS.INVALID_GEMINI_KEY;
    }

    // Check for other Gemini errors
    if (error?.status === 429) {
      throw ERRORS.GEMINI_RATE_LIMIT;
    }

    if (error?.status >= 500) {
      throw ERRORS.GEMINI_API_ERROR;
    }

    // Return as General if classification fails for other reasons
    return {
      ...email,
      category: 'General'
    };
  }
};

/**
 * Classify multiple emails with OpenAI or Gemini
 */
export const classifyEmails = async (
  emails: EmailMessage[],
  apiKey: string,
  provider: 'openai' | 'gemini' = 'openai'
): Promise<ClassifiedEmail[]> => {
  try {
    if (!apiKey) {
      throw provider === 'openai' ? ERRORS.INVALID_OPENAI_KEY : ERRORS.INVALID_GEMINI_KEY;
    }

    if (!emails || emails.length === 0) {
      return [];
    }

    logger.info(`Classifying ${emails.length} emails using ${provider.toUpperCase()}`);

    // Choose classification function based on provider
    const classifyFn = provider === 'openai' ? classifySingleEmail : classifySingleEmailGemini;

    // Smart dynamic batching based on email count
    // Small batches: Process all at once (fast)
    // Medium batches: Split into optimal chunks
    // Large batches: Process in smaller batches to avoid rate limits
    let batchSize: number;
    let delayBetweenBatches: number;

    if (emails.length <= 5) {
      // 1-5 emails: Process all at once, no delay
      batchSize = emails.length;
      delayBetweenBatches = 0;
    } else if (emails.length <= 10) {
      // 6-10 emails: Process all at once, minimal delay
      batchSize = emails.length;
      delayBetweenBatches = 500;
    } else if (emails.length <= 15) {
      // 11-15 emails: Split into 2 batches (8+7 or 10+5)
      batchSize = Math.ceil(emails.length / 2);
      delayBetweenBatches = 800;
    } else if (emails.length <= 25) {
      // 16-25 emails: Process in batches of 8-10
      batchSize = 10;
      delayBetweenBatches = 1000;
    } else if (emails.length <= 40) {
      // 26-40 emails: Process in batches of 10
      batchSize = 10;
      delayBetweenBatches = 1200;
    } else {
      // 40+ emails: Process in smaller batches of 8 with longer delays
      batchSize = 8;
      delayBetweenBatches = 1500;
    }

    logger.info(`Using batch size: ${batchSize}, delay: ${delayBetweenBatches}ms for ${emails.length} emails`);

    const classifiedEmails: ClassifiedEmail[] = [];
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(emails.length / batchSize);
      
      logger.info(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} emails)`);
      
      const batchResults = await Promise.all(
        batch.map(async (email) => {
          try {
            return await classifyFn(email, apiKey);
          } catch (error: any) {
            // If it's an API key error, re-throw to stop processing
            if (error.message?.includes('INVALID_') || 
                error.message?.includes('API key with') || 
                error.message?.includes('API key provided')) {
              throw error;
            }
            // For other errors, log and return General category
            logger.warn(`Failed to classify email ${email.id}, using General category:`, error);
            errors.push(`Failed to classify: ${email.subject}`);
            return {
              ...email,
              category: 'General' as EmailCategory
            };
          }
        })
      );
      classifiedEmails.push(...batchResults);

      // Add delay between batches if there are more batches to process
      if (i + batchSize < emails.length && delayBetweenBatches > 0) {
        logger.info(`Waiting ${delayBetweenBatches}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
      }
    }

    logger.info(`Successfully classified ${classifiedEmails.length} emails using ${provider.toUpperCase()}`);
    if (errors.length > 0) {
      logger.warn(`Some emails had classification errors: ${errors.length} out of ${emails.length}`);
    }
    return classifiedEmails;
  } catch (error: any) {
    logger.error(`Error in email classification with ${provider.toUpperCase()}:`, error);


    throw ERRORS.CLASSIFICATION_FAILED;
  }
};

/**
 * Legacy function for backward compatibility - uses OpenAI
 */
export const classifyEmailsOpenAI = async (
  emails: EmailMessage[],
  openaiApiKey: string
): Promise<ClassifiedEmail[]> => {
  return classifyEmails(emails, openaiApiKey, 'openai');
};

/**
 * Classify emails using Google Gemini
 */
export const classifyEmailsGemini = async (
  emails: EmailMessage[],
  geminiApiKey: string
): Promise<ClassifiedEmail[]> => {
  return classifyEmails(emails, geminiApiKey, 'gemini');
};

/**
 * Get classification statistics
 */
export const getClassificationStats = (classifiedEmails: ClassifiedEmail[]): Record<EmailCategory, number> => {
  const stats: Record<EmailCategory, number> = {
    Important: 0,
    Promotional: 0,
    Social: 0,
    Marketing: 0,
    Spam: 0,
    General: 0
  };

  classifiedEmails.forEach(email => {
    stats[email.category]++;
  });

  return stats;
};
