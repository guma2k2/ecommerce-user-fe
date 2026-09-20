'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys, ROUTES } from '@/shared/constants';
import { useAuthStore } from '@/shared/stores';
import { authService } from '../services/authService';
import { customerProfileService } from '../services/customerProfileService';
import type { OutboundRequest, SocialProvider } from '../types/authTypes';

export function useSocialLogin() {
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const initiateSocialLogin = async (provider: SocialProvider) => {
    try {
      setLoadingProvider(provider);
      const authUrl = await authService.getSocialAuthUrl(provider);
      window.location.href = authUrl;
    } catch (error) {
      setLoadingProvider(null);
      throw error;
    }
  };

  const outboundMutation = useMutation({
    mutationFn: (payload: OutboundRequest) => authService.completeOutboundAuth(payload),
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);

      try {
        const profile = await customerProfileService.getMyProfile();
        setUserProfile(profile);
        queryClient.setQueryData(queryKeys.customer.profile(), profile);
      } catch (err) {
        console.error('Failed to fetch profile during social login:', err);
      }

      router.push(ROUTES.HOME);
    },
  });

  return {
    initiateSocialLogin,
    loadingProvider,
    completeOutboundAuth: outboundMutation.mutate,
    isCompleting: outboundMutation.isPending,
    outboundError: outboundMutation.error,
  };
}
