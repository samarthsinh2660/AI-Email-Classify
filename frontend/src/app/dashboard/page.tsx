'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated, useUser, useLogout } from '@/hooks/useAuth';
import { useFetchAndClassify } from '@/hooks/useEmails';
import { storage } from '@/lib/storage';
import { ClassifiedEmail } from '@/hooks/useEmails';
import { Loader2, Mail, LogOut, RefreshCw, User, ChevronDown } from 'lucide-react';
import EmailList from '@/components/dashboard/EmailList';
import EmailDetail from '@/components/dashboard/EmailDetail';
import StatsPanel from '@/components/dashboard/StatsPanel';
import Dialog from '@/components/ui/Dialog';

export default function DashboardPage(): JSX.Element {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();
  const logout = useLogout();

  const [mounted, setMounted] = useState(false);
  const [emailCount, setEmailCount] = useState(15);
  const [classifiedEmails, setClassifiedEmails] = useState<ClassifiedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ClassifiedEmail | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');
  const [apiKey, setApiKey] = useState('');

  // Dialog state
  const [dialog, setDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const fetchAndClassify = useFetchAndClassify();

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Load from localStorage
    const saved = storage.getClassifiedEmails();
    if (saved && saved.length > 0) {
      setClassifiedEmails(saved);
    }

    // Load saved API key and provider preference
    const savedProvider = storage.getProvider();
    setProvider(savedProvider);

    const savedApiKey = savedProvider === 'openai'
      ? storage.getOpenAIKey()
      : storage.getGeminiKey();

    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Handle URL parameters for email selection
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const emailId = urlParams.get('id');
      if (emailId && saved && saved.length > 0) {
        const email = saved.find(e => e.id === emailId);
        if (email) {
          setSelectedEmail(email);
          setShowDetail(true);
        }
      }
    }
  }, [mounted, router]);

  // Save API key when it changes
  useEffect(() => {
    if (!mounted) return;
    if (apiKey) {
      if (provider === 'openai') {
        storage.setOpenAIKey(apiKey);
      } else {
        storage.setGeminiKey(apiKey);
      }
    }
  }, [apiKey, provider, mounted]);

  // Save provider preference when it changes and load its saved API key
  useEffect(() => {
    if (!mounted) return;
    storage.setProvider(provider);

    // Load the saved API key for the selected provider
    const savedApiKey = provider === 'openai'
      ? storage.getOpenAIKey()
      : storage.getGeminiKey();

    setApiKey(savedApiKey || '');
  }, [provider, mounted]);

  const handleClassify = async () => {
    if (!apiKey) {
      setDialog({
        isOpen: true,
        title: 'API Key Required',
        message: `Please enter your ${provider === 'openai' ? 'OpenAI' : 'Gemini'} API key first.`,
        type: 'error'
      });
      return;
    }

    try {
      const result = await fetchAndClassify.mutateAsync({
        apiKey: apiKey,
        provider: provider,
        limit: emailCount,
      });

      setClassifiedEmails(result.classifiedEmails);
      setDialog({
        isOpen: true,
        title: 'Classification Complete',
        message: `Successfully classified ${result.count} emails using ${provider.toUpperCase()}!`,
        type: 'success'
      });
    } catch (error: any) {
      console.error('Classification error:', error);

      // Handle different error types
      let title = 'Classification Failed';
      let message = 'An unexpected error occurred. Please try again.';

      if (error?.response?.data?.message) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes('OpenAI') && errorMessage.includes('API key')) {
          title = 'Invalid OpenAI API Key';
          message = 'The OpenAI API key you provided is invalid or expired. Please check your key and try again.';
        } else if (errorMessage.includes('Gemini') && errorMessage.includes('API key')) {
          title = 'Invalid Gemini API Key';
          message = 'The Gemini API key you provided is invalid or expired. Please check your key and try again.';
        } else if (errorMessage.includes('Gemini API key with OpenAI')) {
          title = 'Wrong API Key Type';
          message = 'You\'re using a Gemini API key with OpenAI. Please switch to OpenAI provider or use a valid OpenAI API key.';
        } else if (errorMessage.includes('OpenAI API key with Gemini')) {
          title = 'Wrong API Key Type';
          message = 'You\'re using an OpenAI API key with Gemini. Please switch to Gemini provider or use a valid Gemini API key (starts with \'AIzaSy\').';
        } else if (errorMessage.includes('rate limit')) {
          title = 'Rate Limit Exceeded';
          message = 'Too many requests. Please wait a moment and try again.';
        } else if (errorMessage.includes('quota')) {
          title = 'API Quota Exceeded';
          message = 'Your API quota has been exceeded. Please check your account limits.';
        } else {
          message = errorMessage;
        }
      } else if (error?.message) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          title = 'Connection Error';
          message = 'Unable to connect to the server. Please check your internet connection and try again.';
        }
      }

      setDialog({
        isOpen: true,
        title,
        message,
        type: 'error'
      });
    }
  };

  const handleEmailClick = (email: ClassifiedEmail) => {
    setSelectedEmail(email);
    setShowDetail(true);
    // Update URL with email ID
    router.push(`/dashboard?id=${email.id}`);
  };

  const handleLogout = () => {
    logout.mutate();
  };

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Handle authentication redirect
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                <span className="text-blue-600">Email</span>Classify
              </h1>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 px-3 py-2 bg-gray-100 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Provider Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Provider
              </label>
              <div className="relative">
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as 'openai' | 'gemini')}
                  className="appearance-none w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  disabled={fetchAndClassify.isPending}
                >
                  <option value="openai">OpenAI GPT</option>
                  <option value="gemini">Google Gemini</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {provider === 'openai' ? 'OpenAI' : 'Gemini'} API Key
              </label>
              {!apiKey ? (
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter ${provider === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={fetchAndClassify.isPending}
                />
              ) : (
                <div className="w-full px-4 py-2 border border-green-300 bg-green-50 rounded-lg text-green-700 text-sm flex items-center justify-between">
                  <span>API Key saved ✓</span>
                  <button
                    onClick={() => {
                      if (provider === 'openai') {
                        storage.removeOpenAIKey();
                      } else {
                        storage.removeGeminiKey();
                      }
                      setApiKey('');
                    }}
                    className="text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Email Count Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Emails
              </label>
              <div className="relative">
                <select
                  value={emailCount}
                  onChange={(e) => setEmailCount(Number(e.target.value))}
                  className="appearance-none w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  disabled={fetchAndClassify.isPending}
                >
                  <option value={5}>5 emails</option>
                  <option value={10}>10 emails</option>
                  <option value={15}>15 emails</option>
                  <option value={25}>25 emails</option>
                  <option value={50}>50 emails</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Classify Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <button
                onClick={handleClassify}
                disabled={fetchAndClassify.isPending}
                className="w-full flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {fetchAndClassify.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Classifying...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Classify</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        {classifiedEmails.length > 0 && (
          <StatsPanel emails={classifiedEmails} />
        )}

        {/* Email List */}
        {classifiedEmails.length > 0 ? (
          <>
            <EmailList
              emails={classifiedEmails}
              onEmailClick={handleEmailClick}
              selectedEmailId={selectedEmail?.id}
            />

            {/* Email Detail Overlay */}
            {selectedEmail && (
              <EmailDetail
                email={selectedEmail}
                onClose={() => {
                  setSelectedEmail(null);
                  setShowDetail(false);
                  // Remove email ID from URL
                  router.push('/dashboard');
                }}
              />
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Emails Classified Yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Click the "Classify Emails" button above to fetch and classify your emails using AI
            </p>
          </div>
        )}
      </main>

      {/* Dialog */}
      <Dialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
    </div>
  )
}


