/**
 * Email Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import { storage } from '@/lib/storage';

export interface Email {
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

export type EmailCategory = 'Important' | 'Promotional' | 'Social' | 'Marketing' | 'Spam' | 'General';

export interface ClassifiedEmail extends Email {
  category: EmailCategory;
  confidence?: number;
}

interface FetchEmailsResponse {
  emails: Email[];
  count: number;
}

interface ClassifyEmailsRequest {
  emails: Email[];
  apiKey: string;
  provider?: 'openai' | 'gemini';
}

interface ClassifyEmailsResponse {
  classifiedEmails: ClassifiedEmail[];
  stats: Record<EmailCategory, number>;
  count: number;
  provider?: string;
}

interface FetchAndClassifyRequest {
  apiKey: string;
  provider?: 'openai' | 'gemini';
  limit?: number;
}

/**
 * Fetch emails from Gmail
 */
export const useFetchEmails = (limit: number = 15) => {
  return useQuery({
    queryKey: ['emails', limit],
    queryFn: async () => {
      const response = await api.get<{ data: FetchEmailsResponse }>(
        `/api/emails?limit=${limit}`
      );
      return response.data.data;
    },
    enabled: false, // Don't auto-fetch, trigger manually
  });
};

/**
 * Classify emails
 */
export const useClassifyEmails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ClassifyEmailsRequest) => {
      const response = await api.post<{ data: ClassifyEmailsResponse }>(
        '/api/emails/classify',
        data
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Save to localStorage
      storage.setClassifiedEmails(data.classifiedEmails);
      queryClient.setQueryData(['classifiedEmails'], data);
    },
    onError: (error) => {
      console.error('Classification error:', handleApiError(error));
    },
  });
};

/**
 * Fetch and classify emails in one request
 */
export const useFetchAndClassify = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FetchAndClassifyRequest) => {
      const response = await api.post<{ data: ClassifyEmailsResponse }>(
        `/api/emails/fetch-and-classify?limit=${data.limit || 15}`,
        { apiKey: data.apiKey, provider: data.provider || 'openai' }
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Save to localStorage
      storage.setClassifiedEmails(data.classifiedEmails);
      queryClient.setQueryData(['classifiedEmails'], data);
    },
    onError: (error) => {
      console.error('Fetch and classify error:', handleApiError(error));
    },
  });
};

/**
 * Get classified emails from localStorage
 */
export const useClassifiedEmails = () => {
  return useQuery({
    queryKey: ['classifiedEmails'],
    queryFn: async () => {
      const emails = storage.getClassifiedEmails();
      return emails;
    },
    staleTime: Infinity, // Never refetch from server
  });
};
