'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentsListQueryOptions } from './paymentQueries';

export function usePayments() {
  return useQuery(paymentsListQueryOptions());
}
