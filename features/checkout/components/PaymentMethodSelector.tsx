'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreditCard, Banknote, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CheckoutFormInput } from '../validator';

interface PaymentMethodSelectorProps {
  form: UseFormReturn<CheckoutFormInput>;
}

export function PaymentMethodSelector({ form }: PaymentMethodSelectorProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form;

  const currentMethod = watch('paymentMethod');

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Cash On Delivery (COD) */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setValue('paymentMethod', 'COD', { shouldValidate: true })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setValue('paymentMethod', 'COD', { shouldValidate: true });
            }
          }}
          className={cn(
            'flex flex-col gap-2 rounded-xl border p-4 cursor-pointer transition-all duration-200 select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            currentMethod === 'COD'
              ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
              : 'border-border/80 hover:border-border hover:bg-muted/30'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-foreground">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg transition-colors',
                  currentMethod === 'COD'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <Banknote className="size-4" />
              </div>
              <span className="font-semibold text-sm">Cash on Delivery</span>
            </div>
            <div
              className={cn(
                'size-4 rounded-full border flex items-center justify-center',
                currentMethod === 'COD'
                  ? 'border-primary'
                  : 'border-muted-foreground/40'
              )}
            >
              {currentMethod === 'COD' && (
                <div className="size-2 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-10.5">
            Pay with cash when package is delivered to your doorstep.
          </p>
        </div>

        {/* Stripe Credit/Debit Card */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => setValue('paymentMethod', 'STRIPE', { shouldValidate: true })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setValue('paymentMethod', 'STRIPE', { shouldValidate: true });
            }
          }}
          className={cn(
            'flex flex-col gap-2 rounded-xl border p-4 cursor-pointer transition-all duration-200 select-none text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            currentMethod === 'STRIPE'
              ? 'border-primary bg-primary/5 ring-1 ring-primary shadow-sm'
              : 'border-border/80 hover:border-border hover:bg-muted/30'
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-medium text-foreground">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg transition-colors',
                  currentMethod === 'STRIPE'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                <CreditCard className="size-4" />
              </div>
              <span className="font-semibold text-sm">Credit / Debit Card</span>
            </div>
            <div
              className={cn(
                'size-4 rounded-full border flex items-center justify-center',
                currentMethod === 'STRIPE'
                  ? 'border-primary'
                  : 'border-muted-foreground/40'
              )}
            >
              {currentMethod === 'STRIPE' && (
                <div className="size-2 rounded-full bg-primary" />
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-10.5">
            Encrypted checkout powered by Stripe. Supports Visa, MasterCard, Amex.
          </p>
        </div>
      </div>

      {errors.paymentMethod && (
        <p className="text-xs text-destructive">{errors.paymentMethod.message}</p>
      )}

      {currentMethod === 'STRIPE' && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span>You will be safely redirected to Stripe Hosted Checkout to complete payment.</span>
        </div>
      )}
    </div>
  );
}
