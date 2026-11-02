'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui';
import { FormTextarea } from '@/shared/components';
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
  const { t, i18n } = useTranslation('checkout');
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
  const currency = i18n.language === 'vi' ? 'VND' : 'USD';
  const { control } = form;
  const paymentMethod = form.watch('paymentMethod');

  return (
    <Card className="sticky top-24 border-border/80 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShoppingBag className="size-4 text-primary" />
          <span>{t('summary.title')}</span>
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            ({items.length} {items.length === 1 ? t('summary.unitItem') : t('summary.unitItems')})
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
                    -
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
                    {formatCurrency(item.subtotal, currency, locale)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery Note */}
        <div className="pt-2 border-t border-border/60">
          <FormTextarea
            control={control}
            name="note"
            label={t('summary.deliveryNote')}
            rows={2}
            placeholder={t('summary.deliveryNotePlaceholder')}
            className="text-xs"
          />
        </div>

        {/* Pricing Calculation Breakdown */}
        <div className="space-y-2 pt-3 border-t border-border/60 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>{t('summary.subtotal')}</span>
            <span className="font-medium text-foreground">
              {formatCurrency(subtotal, currency, locale)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>{t('summary.shipping')}</span>
            <span className="font-medium text-foreground">
              {shippingFee === 0 ? t('summary.freeShipping') : formatCurrency(shippingFee, currency, locale)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border/60 text-sm font-semibold text-foreground">
            <span>{t('summary.total')}</span>
            <span className="text-base text-primary">
              {formatCurrency(total, currency, locale)}
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
              {t('summary.processing')}
            </>
          ) : paymentMethod === 'STRIPE' ? (
            t('summary.payWithStripe')
          ) : (
            t('summary.confirmOrder')
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{t('summary.secureGuarantee')}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
