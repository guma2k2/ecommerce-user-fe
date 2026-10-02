'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, CreditCard, Calendar, FileText, XCircle } from 'lucide-react';
import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { formatCurrency } from '@/shared/utils/appUtils';
import { cn } from '@/lib/utils';
import { useOrderDetail } from '../hooks';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { OrderTrackingStepper } from './OrderTrackingStepper';
import { CancelOrderDialog } from './CancelOrderDialog';
import { OrderDetailSkeleton } from './OrderSkeleton';

interface OrderDetailContainerProps {
  orderId: string;
}

export function OrderDetailContainer({ orderId }: OrderDetailContainerProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId);

  if (isLoading) {
    return <OrderDetailSkeleton />;
  }

  if (isError || !order) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Order Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested order does not exist or you do not have permission to view it.
        </p>
        <Link
          href={ROUTES.ACCOUNT.ORDERS}
          className={buttonVariants()}
        >
          Back to Orders
        </Link>
      </div>
    );
  }

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ACCOUNT.ORDERS}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
          >
            <ArrowLeft className="size-4" />
            <span>Back to Orders</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground font-mono">
                {order.orderCode}
              </h1>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="size-3" />
              <span>Placed on {formattedDate}</span>
            </p>
          </div>
        </div>

        {order.status === 'PENDING' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCancelDialogOpen(true)}
            className="text-xs text-destructive hover:bg-destructive/10 hover:border-destructive/30"
          >
            <XCircle className="size-3.5 mr-1.5" />
            <span>Cancel Order</span>
          </Button>
        )}
      </div>

      {/* Visual Tracking Stepper */}
      <Card className="border-border/80 p-6">
        <OrderTrackingStepper status={order.status} />
      </Card>

      {/* Recipient & Payment Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card className="border-border/80">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <MapPin className="size-4 text-primary" />
              <span>Delivery Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs space-y-2 text-muted-foreground">
            <p className="font-semibold text-foreground text-sm">
              {order.shippingAddress?.receiverName}
            </p>
            <p>Phone: {order.shippingAddress?.receiverPhone}</p>
            <p className="leading-relaxed">
              {order.shippingAddress?.shippingAddress}, {order.shippingAddress?.district},{' '}
              {order.shippingAddress?.city}
            </p>
            <p>Postal Code: {order.shippingAddress?.postalCode}</p>
            {order.note && (
              <div className="mt-3 pt-3 border-t border-border/40 flex items-start gap-1.5">
                <FileText className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="italic">&ldquo;{order.note}&rdquo;</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="border-border/80">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="size-4 text-primary" />
              <span>Payment Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 text-xs space-y-3 text-muted-foreground">
            <div className="flex justify-between items-center">
              <span>Payment Method:</span>
              <span className="font-medium text-foreground">
                {order.paymentMethod === 'STRIPE' ? 'Credit / Debit Card (Stripe)' : 'Cash on Delivery (COD)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Payment Status:</span>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <span className="font-semibold text-foreground">Order Total:</span>
              <span className="font-bold text-base text-primary">
                {formatCurrency(order.totalAmount, 'USD', 'en-US')}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Ordered List */}
      <Card className="border-border/80">
        <CardHeader className="pb-4 border-b border-border/40">
          <CardTitle className="text-sm font-semibold">
            Ordered Items ({order.items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 divide-y divide-border/60">
          {(order.items || []).map((item) => (
            <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate" title={item.productName}>
                  {item.productName}
                </p>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <span>SKU: {item.sku}</span>
                  <span>•</span>
                  <span>Qty: {item.quantity}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-foreground">
                  {formatCurrency(item.totalPrice, 'USD', 'en-US')}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {formatCurrency(item.unitPrice, 'USD', 'en-US')} each
                </p>
              </div>
            </div>
          ))}

          {/* Pricing Calculation Breakdown */}
          <div className="pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">
                {formatCurrency(order.totalAmount - (order.shippingFee || 0), 'USD', 'en-US')}
              </span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping Fee</span>
              <span className="font-medium text-foreground">
                {order.shippingFee ? formatCurrency(order.shippingFee, 'USD', 'en-US') : 'Free'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/60 text-sm font-bold text-foreground">
              <span>Total Paid</span>
              <span className="text-base text-primary">
                {formatCurrency(order.totalAmount, 'USD', 'en-US')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <CancelOrderDialog
        orderId={order.id}
        orderCode={order.orderCode}
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
