'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { authService } from '../services/authService';
import type { VerifyOtpRequest } from '../types/authTypes';

export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: VerifyOtpRequest) => authService.verifyEmail(payload),
    onSuccess: () => {
      router.push(`${ROUTES.AUTH.LOGIN}?verified=true`);
    },
  });
}
