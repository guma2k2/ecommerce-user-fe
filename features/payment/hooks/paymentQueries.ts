import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { paymentService } from '../services';

export const paymentDetailQueryOptions = (paymentId: string) =>
  queryOptions({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => paymentService.getPaymentDetail(paymentId),
    staleTime: 30 * 1000,
    enabled: Boolean(paymentId),
  });

export const paymentsListQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.payments.lists(),
    queryFn: () => paymentService.getPayments(),
    staleTime: 60 * 1000,
  });

export const paymentLedgerQueryOptions = (paymentId: string) =>
  queryOptions({
    queryKey: queryKeys.payments.ledger(paymentId),
    queryFn: () => paymentService.getPaymentLedger(paymentId),
    staleTime: 30 * 1000,
    enabled: Boolean(paymentId),
  });
