/**
 * Local Storage Utilities
 */

export interface User {
  email: string;
  name: string;
  picture?: string;
}

export const storage = {
  // Access Token
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem('accessToken', token);
  },

  removeAccessToken: (): void => {
    localStorage.removeItem('accessToken');
  },

  // Refresh Token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem('refreshToken', token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem('refreshToken');
  },

  // User
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  // OpenAI API Key
  getOpenAIKey: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('openaiApiKey');
  },

  setOpenAIKey: (key: string): void => {
    localStorage.setItem('openaiApiKey', key);
  },

  removeOpenAIKey: (): void => {
    localStorage.removeItem('openaiApiKey');
  },

  // Gemini API Key
  getGeminiKey: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('geminiApiKey');
  },

  setGeminiKey: (key: string): void => {
    localStorage.setItem('geminiApiKey', key);
  },

  removeGeminiKey: (): void => {
    localStorage.removeItem('geminiApiKey');
  },

  // AI Provider Preference
  getProvider: (): 'openai' | 'gemini' => {
    if (typeof window === 'undefined') return 'gemini';
    return (localStorage.getItem('aiProvider') as 'openai' | 'gemini') || 'gemini';
  },

  setProvider: (provider: 'openai' | 'gemini'): void => {
    localStorage.setItem('aiProvider', provider);
  },

  removeProvider: (): void => {
    localStorage.removeItem('aiProvider');
  },

  // Classified Emails
  getClassifiedEmails: (): any[] => {
    if (typeof window === 'undefined') return [];
    const emails = localStorage.getItem('classifiedEmails');
    return emails ? JSON.parse(emails) : [];
  },

  setClassifiedEmails: (emails: any[]): void => {
    localStorage.setItem('classifiedEmails', JSON.stringify(emails));
  },

  removeClassifiedEmails: (): void => {
    localStorage.removeItem('classifiedEmails');
  },

  // Clear all
  clearAll: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('openaiApiKey');
    localStorage.removeItem('geminiApiKey');
    localStorage.removeItem('aiProvider');
    localStorage.removeItem('classifiedEmails');
  },
};
