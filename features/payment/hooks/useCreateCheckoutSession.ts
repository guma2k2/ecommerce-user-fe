'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { paymentService } from '../services';
import type { CheckoutSessionRequest, CheckoutSessionResponse } from '../types';

interface CreateCheckoutSessionParams {
  payload: CheckoutSessionRequest;
  idempotencyKey?: string;
}

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation<CheckoutSessionResponse, Error, CreateCheckoutSessionParams>({
    mutationFn: ({ payload, idempotencyKey }: CreateCheckoutSessionParams) =>
      paymentService.createCheckoutSession(payload, idempotencyKey),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.lists() });
      if (data.paymentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.payments.detail(data.paymentId),
        });
      }
    },
  });
}
