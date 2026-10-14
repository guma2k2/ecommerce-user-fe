'use client';

import React from 'react';
import { Badge } from '@/components/ui';
import type { PaymentStatus } from '../types';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  switch (status) {
    case 'SUCCEEDED':
      return (
        <Badge variant="success" className={className}>
          Paid
        </Badge>
      );
    case 'PENDING':
      return (
        <Badge variant="accent" className={className}>
          Awaiting Payment
        </Badge>
      );
    case 'FAILED':
      return (
        <Badge variant="destructive" className={className}>
          Payment Failed
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="outline" className={className}>
          Payment Cancelled
        </Badge>
      );
    case 'PARTIALLY_REFUNDED':
      return (
        <Badge variant="secondary" className={className}>
          Partially Refunded
        </Badge>
      );
    case 'REFUNDED':
      return (
        <Badge variant="secondary" className={className}>
          Refunded
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
