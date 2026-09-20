'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { authService } from '../services/authService';
import type { ResetPasswordRequest } from '../types/authTypes';

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: ResetPasswordRequest) => authService.resetPassword(payload),
    onSuccess: () => {
      router.push(`${ROUTES.AUTH.LOGIN}?reset=true`);
    },
  });
}
