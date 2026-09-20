'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants';
import { authService } from '../services/authService';
import type { SignUpRequest } from '../types/authTypes';

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: SignUpRequest) => authService.signUp(payload),
    onSuccess: (_, variables) => {
      router.push(
        `${ROUTES.AUTH.VERIFY_EMAIL}?email=${encodeURIComponent(variables.email)}`
      );
    },
  });
}
