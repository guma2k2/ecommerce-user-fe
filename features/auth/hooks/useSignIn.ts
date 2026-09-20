'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { queryKeys, ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { authService } from '../services/authService';
import { customerProfileService } from '../services/customerProfileService';
import type { SignInRequest } from '../types/authTypes';

export function useSignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  return useMutation({
    mutationFn: (payload: SignInRequest) => authService.signIn(payload),
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);

      // Fetch and hydrate profile immediately
      try {
        const profile = await customerProfileService.getMyProfile();
        setUserProfile(profile);
        queryClient.setQueryData(queryKeys.customer.profile(), profile);
      } catch (err) {
        console.error('Failed to fetch profile during sign-in:', err);
      }

      const returnUrl = searchParams.get('returnUrl') || ROUTES.HOME;
      router.push(returnUrl);
    },
  });
}
