'use client';

import React from 'react';
import { OrderDetailContainer } from '@/features/orders';
import {
  PayOrderButton,
  PaymentLedgerDialog,
  RefundPaymentDialog,
  usePayments,
} from '@/features/payment';

interface OrderDetailClientProps {
  orderId: string;
}

export function OrderDetailClient({ orderId }: OrderDetailClientProps) {
  const { data: payments } = usePayments();

  return (
    <OrderDetailContainer
      orderId={orderId}
      renderPaymentAction={(order) => {
        // Find associated payment for this order
        const associatedPayment = payments?.find(
          (p) => p.orderId === order.id || p.orderId === order.orderCode
        );

        const canPay =
          order.status === 'PENDING' &&
          order.paymentMethod === 'STRIPE' &&
          order.paymentStatus !== 'SUCCEEDED';

        const refundableAmount = associatedPayment
          ? associatedPayment.amount - (associatedPayment.refundedAmount || 0)
          : 0;

        const canRefund =
          associatedPayment &&
          (associatedPayment.status === 'SUCCEEDED' ||
            associatedPayment.status === 'PARTIALLY_REFUNDED') &&
          refundableAmount > 0;

        return (
          <div className="space-y-2 pt-1">
            {canPay && (
              <PayOrderButton
                orderId={order.id}
                orderCode={order.orderCode}
                amount={order.totalAmount}
                currency="USD"
              />
            )}

            {associatedPayment && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <PaymentLedgerDialog
                  paymentId={associatedPayment.id}
                  orderId={order.orderCode}
                />

                {canRefund && (
                  <RefundPaymentDialog
                    paymentId={associatedPayment.id}
                    orderId={order.orderCode}
                    maxAmount={refundableAmount}
                    currency={associatedPayment.currency || 'USD'}
                  />
                )}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
