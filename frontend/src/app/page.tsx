'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIsAuthenticated } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import AuthPage from '@/components/auth/AuthPage';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthPage />;
}
