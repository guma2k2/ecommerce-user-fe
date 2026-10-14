'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { paymentService } from '../services';
import type { RefundPaymentRequest, RefundPaymentResponse } from '../types';

interface RefundPaymentParams {
  paymentId: string;
  payload: RefundPaymentRequest;
  idempotencyKey?: string;
}

export function useRefundPayment() {
  const queryClient = useQueryClient();

  return useMutation<RefundPaymentResponse, Error, RefundPaymentParams>({
    mutationFn: ({ paymentId, payload, idempotencyKey }: RefundPaymentParams) =>
      paymentService.requestRefund(paymentId, payload, idempotencyKey),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.ledger(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.payments.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.orders.all,
      });
    },
  });
}
