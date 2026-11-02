'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui';
import type { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const { t } = useTranslation('payment');

  switch (status) {
    case 'SUCCEEDED':
      return (
        <Badge variant="success" className={className}>
          {t('status.paid')}
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="accent" className={className}>
          {t('status.awaitingPayment')}
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="destructive" className={className}>
          {t('status.failed')}
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" className={className}>
          {t('status.cancelled')}
        </Badge>
      );
    case 'PARTIALLY_REFUNDED':
      return (
        <Badge variant="secondary" className={className}>
          {t('status.partiallyRefunded')}
        </Badge>
      );
    case 'REFUNDED':
      return (
        <Badge variant="secondary" className={className}>
          {t('status.refunded')}
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
