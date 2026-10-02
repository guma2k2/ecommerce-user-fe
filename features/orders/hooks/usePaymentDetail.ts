'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentDetailQueryOptions } from './orderQueries';

export function usePaymentDetail(paymentId: number | string) {
  return useQuery(paymentDetailQueryOptions(paymentId));
}
