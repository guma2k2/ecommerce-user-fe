'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentDetailQueryOptions } from './paymentQueries';

export function usePaymentDetail(paymentId: string) {
  return useQuery(paymentDetailQueryOptions(paymentId));
}
