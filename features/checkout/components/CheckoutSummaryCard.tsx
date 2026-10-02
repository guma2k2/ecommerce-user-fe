'use client';

import React from 'react';
import Image from 'next/image';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardFooter, Label } from '@/components/ui';
import { formatCurrency } from '@/shared/utils/appUtils';
import type { CheckoutCartItem } from '../types';
import type { CheckoutFormInput } from '../validator';

interface CheckoutSummaryCardProps {
  items: CheckoutCartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  form: UseFormReturn<CheckoutFormInput>;
  isSubmitting: boolean;
  onSubmit: () => void;
}

export function CheckoutSummaryCard({
  items,
  subtotal,
  shippingFee,
  total,
  form,
  isSubmitting,
  onSubmit,
}: CheckoutSummaryCardProps) {
  const { register } = form;
  const paymentMethod = form.watch('paymentMethod');

  return (
    <Card className="sticky top-24 border-border/80 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShoppingBag className="size-4 text-primary" />
          <span>Order Summary</span>
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Line Items List */}
        <div className="max-h-64 overflow-y-auto divide-y divide-border/60 pr-1 space-y-3">
          {items.map((item) => (
            <div key={item.variantId} className="flex items-center gap-3 pt-3 first:pt-0">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-xs text-foreground" title={item.productName}>
                  {item.productName}
                </p>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(item.subtotal, 'USD', 'en-US')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Note */}
        <div className="space-y-1.5 pt-2 border-t border-border/60">
          <Label htmlFor="checkoutNote" className="text-xs">
            Delivery Note (Optional)
          </Label>
          <textarea
            id="checkoutNote"
            rows={2}
            placeholder="e.g. Leave with security guard, call before delivery"
            className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1.5 text-xs shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:opacity-50"
            {...register('note')}
          />
        </div>

        {/* Pricing Calculation Breakdown */}
        <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-medium text-foreground">
              {formatCurrency(subtotal, 'USD', 'en-US')}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping Fee</span>
            <span className="font-medium text-foreground">
              {shippingFee === 0 ? 'Free' : formatCurrency(shippingFee, 'USD', 'en-US')}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border/60 text-sm font-semibold text-foreground">
            <span>Total Amount</span>
            <span className="text-base text-primary">
              {formatCurrency(total, 'USD', 'en-US')}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-0">
        <Button
          type="button"
          className="w-full text-sm font-semibold h-11"
          disabled={isSubmitting || items.length === 0}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              Processing Order...
            </>
          ) : paymentMethod === 'STRIPE' ? (
            'Proceed to Stripe Checkout'
          ) : (
            'Confirm & Place Order (COD)'
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Guaranteed secure & encrypted checkout</span>
        </div>
      </CardFooter>
    </Card>
  );
}
