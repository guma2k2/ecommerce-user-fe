'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Package, ArrowRight, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, Button, buttonVariants, Typography } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { formatCurrency } from '@/shared/utils/appUtils';
import { cn } from '@/lib/utils';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { CancelOrderDialog } from './CancelOrderDialog';
import type { OrderSummary } from '../types';

interface OrderCardProps {
  order: OrderSummary;
  onRefresh?: () => void;
}

export function OrderCard({ order, onRefresh }: OrderCardProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <>
      <Card className="border-border/80 hover:border-border hover:shadow-md transition-all duration-200">
        <CardHeader className="py-4 border-b border-border/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Typography.Tabular className="font-mono font-bold text-sm text-foreground">
                  {order.orderCode}
                </Typography.Tabular>
                <span className="text-xs text-muted-foreground">•</span>
                <Typography.Caption className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formattedDate}
                </Typography.Caption>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PaymentStatusBadge status={order.paymentStatus} />
              <OrderStatusBadge status={order.status} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Package className="size-3.5 text-muted-foreground" />
                <span>
                  {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                </span>
                <span>•</span>
                <span>Payment: {order.paymentMethod === 'STRIPE' ? 'Card (Stripe)' : 'Cash on Delivery'}</span>
              </div>
              <div>
                <span>Total: </span>
                <Typography.Tabular className="font-semibold text-sm text-primary">
                  {formatCurrency(order.totalAmount)}
                </Typography.Tabular>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {order.status === 'PENDING' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCancelDialogOpen(true)}
                  className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                >
                  <XCircle className="size-3.5" />
                  <span>Cancel</span>
                </Button>
              )}

              <Link
                href={ROUTES.ACCOUNT.ORDER_DETAIL(order.id)}
                className={cn(buttonVariants({ size: 'sm' }), 'gap-1.5 text-xs')}
              >
                <span>View Details</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <CancelOrderDialog
        orderId={order.id}
        orderCode={order.orderCode}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  );
}
