'use client';

import { useEffect, useState } from 'react';
import { useGetAuthUrl } from '@/hooks/useAuth';
import { storage } from '@/lib/storage';
import { Loader2, Mail, Sparkles } from 'lucide-react';

export default function AuthPage() {
  const [openaiKey, setOpenaiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const { data: authData, refetch, isLoading, isError } = useGetAuthUrl();

  useEffect(() => {
    const savedKey = storage.getOpenAIKey();
    if (savedKey) {
      setOpenaiKey(savedKey);
      setShowApiKeyInput(true);
    }
  }, []);

  const handleGoogleLogin = () => {
    if (!openaiKey.trim()) {
      alert('Please enter your OpenAI API key first');
      return;
    }

    // Save OpenAI key to localStorage
    storage.setOpenAIKey(openaiKey);

    // Redirect to Google OAuth
    if (authData?.authUrl) {
      window.location.href = authData.authUrl;
    } else {
      refetch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Email<span className="text-blue-600">Classify</span>
          </h1>
          <p className="text-gray-600">
            Classify your emails intelligently with AI
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* OpenAI API Key Input */}
          {!showApiKeyInput ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">
                      OpenAI API Key Required
                    </h3>
                    <p className="text-sm text-blue-700">
                      To classify your emails, you'll need to provide your OpenAI API key.
                      Your key is stored securely in your browser and never sent to our servers.
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowApiKeyInput(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Enter API Key
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                  OpenAI API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenAI Dashboard
                  </a>
                </p>
              </div>

              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || !openaiKey.trim()}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span>Login with Google</span>
                  </>
                )}
              </button>

              {isError && (
                <p className="text-sm text-red-600 text-center">
                  Failed to connect. Please try again.
                </p>
              )}
            </div>
          )}

          {/* Features */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">AI-Powered Classification</p>
                <p className="text-xs text-gray-500">Automatically categorize emails using GPT-4o</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Secure & Private</p>
                <p className="text-xs text-gray-500">Data stored locally in your browser</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">No Database</p>
                <p className="text-xs text-gray-500">No emails stored on servers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          By continuing, you agree to access your Gmail data for classification purposes only
        </p>
      </div>
    </div>
  );
}
