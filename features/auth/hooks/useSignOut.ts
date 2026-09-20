'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { authService } from '../services/authService';

export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push(ROUTES.HOME);
    },
  });
}
