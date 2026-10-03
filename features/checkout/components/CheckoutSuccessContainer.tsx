'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, PackageCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card, CardContent, buttonVariants, Typography } from '@/components/ui';
import { ROUTES } from '@/shared/constants';
import { cn } from '@/lib/utils';

interface CheckoutSuccessContainerProps {
  orderCode?: string | null;
  orderId?: string | null;
  sessionId?: string | null;
}

export function CheckoutSuccessContainer({
  orderCode,
  orderId,
  sessionId,
}: CheckoutSuccessContainerProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
      <Card className="text-center border-border/80 shadow-lg">
        <CardContent className="pt-10 pb-10 space-y-6">
          {/* Animated Success Badge */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/5 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="size-10 stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <Typography.H1 className="text-2xl sm:text-3xl font-bold">
              Thank You For Your Order!
            </Typography.H1>
            <Typography.Muted className="text-sm max-w-md mx-auto block">
              Your order has been received and is being processed by our fulfillment team.
            </Typography.Muted>
          </div>

          {/* Reference Details */}
          {(orderCode || orderId || sessionId) && (
            <div className="rounded-xl border border-border/80 bg-muted/40 p-4 max-w-md mx-auto space-y-2 text-xs">
              {orderCode && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">Order Reference:</span>
                  <Typography.Tabular className="font-mono font-bold text-foreground text-sm">
                    {orderCode}
                  </Typography.Tabular>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between items-center py-1 border-t border-border/60">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-muted-foreground truncate max-w-[200px]" title={orderId}>
                    {orderId}
                  </span>
                </div>
              )}
              {sessionId && (
                <div className="flex justify-between items-center py-1 border-t border-border/60">
                  <span className="text-muted-foreground">Stripe Session:</span>
                  <span className="font-mono text-muted-foreground truncate max-w-[200px]" title={sessionId}>
                    {sessionId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Next Steps Guidance */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 max-w-md mx-auto text-left text-xs space-y-2">
            <p className="font-semibold text-primary flex items-center gap-1.5">
              <PackageCheck className="size-4" />
              <span>What happens next?</span>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-1">
              <li>You can view status updates anytime in your account portal.</li>
              <li>Our delivery partner will reach out before delivery.</li>
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            {orderId ? (
              <Link
                href={ROUTES.ACCOUNT.ORDER_DETAIL(orderId)}
                className={cn(buttonVariants(), 'w-full sm:w-auto gap-2')}
              >
                <span>View Order Details</span>
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                href={ROUTES.ACCOUNT.ORDERS}
                className={cn(buttonVariants(), 'w-full sm:w-auto gap-2')}
              >
                <span>View My Orders</span>
                <ArrowRight className="size-4" />
              </Link>
            )}

            <Link
              href={ROUTES.SHOP.CATALOG}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full sm:w-auto gap-2')}
            >
              <ShoppingBag className="size-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
