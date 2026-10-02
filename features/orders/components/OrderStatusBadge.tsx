'use client';

import React from 'react';
import { Badge } from '@/components/ui';
import type { OrderStatus, PaymentStatus } from '../types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  switch (status) {
    case 'PENDING':
      return (
        <Badge variant="accent" className={className}>
          Pending
        </Badge>
      );
    case 'CONFIRMED':
      return (
        <Badge variant="default" className={className}>
          Confirmed
        </Badge>
      );
    case 'PROCESSING':
      return (
        <Badge variant="secondary" className={className}>
          Processing
        </Badge>
      );
    case 'SHIPPING':
      return (
        <Badge variant="outline" className={className}>
          Shipping
        </Badge>
      );
    case 'DELIVERED':
      return (
        <Badge variant="success" className={className}>
          Delivered
        </Badge>
      );
    case 'CANCELLED':
      return (
        <Badge variant="destructive" className={className}>
          Cancelled
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
