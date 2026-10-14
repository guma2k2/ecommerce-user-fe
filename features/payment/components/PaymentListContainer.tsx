'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, Calendar, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  buttonVariants,
  Skeleton,
  Typography,
} from '@/components/ui';
import { formatCurrency } from '@/shared/utils/appUtils';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/lib/utils';
import { usePayments } from '../hooks';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { PaymentLedgerDialog } from './PaymentLedgerDialog';
import { RefundPaymentDialog } from './RefundPaymentDialog';

export function PaymentListContainer() {
  const { data: payments, isLoading, isError, refetch } = usePayments();

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <Typography.H2 className="text-xl font-bold">Failed to Load Payments</Typography.H2>
        <Typography.Muted className="text-sm">
          An error occurred while fetching your payment history. Please try again.
        </Typography.Muted>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
          <CreditCard className="size-8" />
        </div>
        <Typography.H2 className="text-xl font-bold">No Payments Found</Typography.H2>
        <Typography.Muted className="text-sm max-w-md mx-auto block">
          You haven&apos;t completed any transactions yet. When you place an order, your payment history will appear here.
        </Typography.Muted>
        <Link href={ROUTES.SHOP.CATALOG} className={cn(buttonVariants(), 'mt-2 gap-2')}>
          <span>Start Shopping</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography.H1 className="text-2xl font-bold tracking-tight">
            Payments & Invoices
          </Typography.H1>
          <Typography.Muted className="text-sm mt-1">
            Review your transaction charges, ledger audit records, and refund requests.
          </Typography.Muted>
        </div>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => {
          const refundableAmount = payment.amount - (payment.refundedAmount || 0);
          const canRefund =
            (payment.status === 'SUCCEEDED' || payment.status === 'PARTIALLY_REFUNDED') &&
            refundableAmount > 0;

          return (
            <Card key={payment.id} className="border-border/80 shadow-xs hover:border-border transition-colors">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-primary" />
                      <CardTitle className="text-sm font-bold font-mono">
                        {payment.id}
                      </CardTitle>
                      <PaymentStatusBadge status={payment.status} />
                    </div>
                    {payment.orderId && (
                      <CardDescription className="text-xs">
                        Associated Order: <span className="font-mono font-medium text-foreground">{payment.orderId}</span>
                      </CardDescription>
                    )}
                  </div>

                  <div className="text-right">
                    <Typography.Tabular className="text-base font-bold text-foreground block">
                      {formatCurrency(payment.amount, payment.currency || 'USD')}
                    </Typography.Tabular>
                    {payment.refundedAmount > 0 && (
                      <span className="text-[11px] text-destructive block">
                        Refunded: {formatCurrency(payment.refundedAmount, payment.currency || 'USD')}
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-primary" />
                    <span>
                      Method: <strong className="text-foreground">{payment.method}</strong>
                    </span>
                  </div>
                  {payment.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="size-3.5" />
                      <span>
                        Created: {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  )}
                  {payment.gatewayTransactionId && (
                    <div className="font-mono text-[11px] text-muted-foreground truncate max-w-sm">
                      Txn: {payment.gatewayTransactionId}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                  <PaymentLedgerDialog paymentId={payment.id} orderId={payment.orderId} />

                  {canRefund && (
                    <RefundPaymentDialog
                      paymentId={payment.id}
                      orderId={payment.orderId}
                      maxAmount={refundableAmount}
                      currency={payment.currency}
                    />
                  )}

                  {payment.orderId && (
                    <Link
                      href={ROUTES.ACCOUNT.ORDER_DETAIL(payment.orderId)}
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5 text-xs')}
                    >
                      <span>View Order</span>
                      <ExternalLink className="size-3.5" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
