/**
 * Authentication Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiError } from '@/lib/api';
import { storage, User } from '@/lib/storage';
import { useRouter } from 'next/navigation';

interface AuthUrlResponse {
  authUrl: string;
}

/**
 * Get Google OAuth URL
 */
export const useGetAuthUrl = () => {
  return useQuery({
    queryKey: ['authUrl'],
    queryFn: async () => {
      const response = await api.get<{ data: AuthUrlResponse }>('/api/auth/google');
      return response.data.data;
    },
  });
};

/**
 * Logout hook
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      storage.clearAll();
    },
    onSuccess: () => {
      queryClient.clear();
      router.push('/');
    },
  });
};

/**
 * Get current user from storage
 */
export const useUser = (): User | null => {
  return storage.getUser();
};

/**
 * Check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  return !!storage.getAccessToken() && !!storage.getUser();
};
