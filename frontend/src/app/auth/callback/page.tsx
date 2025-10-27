'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { storage } from '@/lib/storage';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const error = searchParams.get('error');

    if (error) {
      alert('Authentication failed. Please try again.');
      router.push('/');
      return;
    }

    if (accessToken && email && name) {
      // Store tokens and user info
      storage.setAccessToken(accessToken);
      if (refreshToken) {
        storage.setRefreshToken(refreshToken);
      }
      storage.setUser({
        email,
        name,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      alert('Authentication failed. Missing required parameters.');
      router.push('/');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Authenticating...
        </h2>
        <p className="text-gray-600">
          Please wait while we complete your login
        </p>
      </div>
    </div>
  );
}
