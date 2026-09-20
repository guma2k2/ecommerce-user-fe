'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { ResendVerificationRequest } from '../types/authTypes';

export function useResendVerification() {
  return useMutation({
    mutationFn: (payload: ResendVerificationRequest) =>
      authService.resendVerification(payload),
  });
}
