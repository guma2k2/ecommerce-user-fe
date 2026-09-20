'use client';

import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { ForgotPasswordRequest } from '../types/authTypes';

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordRequest) => authService.forgotPassword(payload),
  });
}
