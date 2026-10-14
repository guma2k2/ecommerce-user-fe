'use client';

import { useQuery } from '@tanstack/react-query';
import { paymentLedgerQueryOptions } from './paymentQueries';

export function usePaymentLedger(paymentId: string) {
  return useQuery(paymentLedgerQueryOptions(paymentId));
}
