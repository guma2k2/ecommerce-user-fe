'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck, Lock, Truck } from 'lucide-react';
import { Button, buttonVariants, Card, CardContent, CardHeader, CardTitle, Separator } from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import type { CartItem } from '../types';

interface CartSummaryProps {
  totalPrice: number;
  totalQuantity: number;
  items: CartItem[];
}

export function CartSummary({
  totalPrice,
  totalQuantity,
  items,
}: CartSummaryProps) {
  const { t } = useTranslation('cart');
  const hasOutOfStockItems = items.some((item) => item.variant.stockQuantity <= 0);
  const hasExceededItems = items.some((item) => item.quantity > item.variant.stockQuantity);
  const isCheckoutDisabled = hasOutOfStockItems || hasExceededItems || totalQuantity === 0;

  // Shipping calculation logic: Free shipping for orders > $100 (or $0 when empty), otherwise $10
  const shippingFee = totalPrice > 100 || totalPrice === 0 ? 0 : 10;
  const finalTotal = totalPrice + shippingFee;

  return (
    <Card className="rounded-2xl border-border/70 bg-card/80 backdrop-blur-xs shadow-xs sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">{t('summary.title')}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>
              {t('summary.subtotalWithCount', {
                count: totalQuantity,
                unit: totalQuantity === 1 ? t('summary.unitItem') : t('summary.unitItems'),
              })}
            </span>
            <span className="font-semibold text-foreground">{formatCurrency(totalPrice)}</span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>{t('summary.shipping')}</span>
            <span className="font-semibold text-foreground">
              {shippingFee === 0 ? (
                <span className="text-emerald-600 font-bold">{t('summary.freeShipping')}</span>
              ) : (
                formatCurrency(shippingFee)
              )}
            </span>
          </div>

          <Separator className="my-2 bg-border/60" />

          <div className="flex items-center justify-between text-base font-bold">
            <span className="text-foreground">{t('summary.total')}</span>
            <span className="text-xl font-extrabold text-primary tracking-tight">
              {formatCurrency(finalTotal)}
            </span>
          </div>
        </div>

        {/* Warning if stock issues exist */}
        {hasOutOfStockItems && (
          <p className="text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded-lg">
            {t('summary.outOfStockWarning')}
          </p>
        )}
        {!hasOutOfStockItems && hasExceededItems && (
          <p className="text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded-lg">
            {t('summary.exceededWarning')}
          </p>
        )}

        {/* Checkout Button */}
        {isCheckoutDisabled ? (
          <Button
            disabled
            size="lg"
            className="w-full rounded-xl font-bold h-12 gap-2 shadow-sm"
          >
            {t('summary.checkout')}
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Link
            href={ROUTES.SHOP.CHECKOUT}
            className={cn(
              buttonVariants({ size: 'lg' }),
              'w-full rounded-xl font-bold h-12 gap-2 shadow-sm flex items-center justify-center'
            )}
          >
            {t('summary.checkout')}
            <ArrowRight className="size-4" />
          </Link>
        )}

        {/* Value Guarantees */}
        <div className="pt-2 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5 text-primary shrink-0" />
            <span>{t('summary.guaranteeEncrypted')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="size-3.5 text-primary shrink-0" />
            <span>{t('summary.guaranteeFastDelivery')}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-3.5 text-primary shrink-0" />
            <span>{t('summary.guaranteeGenuine')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
