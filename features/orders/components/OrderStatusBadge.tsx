'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';
import type { OrderStatus, PaymentStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { t } = useTranslation('orders');

  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="accent" className={className}>
          {t('status.pending')}
        </Badge>
      );
    case 'CONFIRMED':
      return (
        <Badge variant="default" className={className}>
          {t('status.confirmed')}
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge variant="secondary" className={className}>
          {t('status.processing')}
        </Badge>
      );
    case 'SHIPPING':
      return (
        <Badge variant="outline" className={className}>
          {t('status.shipping')}
        </Badge>
      );
    case 'DELIVERED':
      return (
        <Badge variant="success" className={className}>
          {t('status.delivered')}
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="destructive" className={className}>
          {t('status.cancelled')}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const { t } = useTranslation('orders');

  switch (status) {
    case 'SUCCEEDED':
      return (
        <Badge variant="success" className={className}>
          {t('paymentStatus.paid')}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="accent" className={className}>
          {t('paymentStatus.awaitingPayment')}
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="destructive" className={className}>
          {t('paymentStatus.failed')}
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" className={className}>
          {t('paymentStatus.cancelled')}
        </Badge>
      );
    case 'PARTIALLY_REFUNDED':
      return (
        <Badge variant="secondary" className={className}>
          {t('paymentStatus.partiallyRefunded')}
        </Badge>
      );
    case 'REFUNDED':
      return (
        <Badge variant="secondary" className={className}>
          {t('paymentStatus.refunded')}
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={className}>
          {status}
        </Badge>
      );
  }
}
