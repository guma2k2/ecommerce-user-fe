'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { Button, Badge, Alert, AlertDescription, Typography } from '@/components/ui';
import { useAddToCart } from '@/features/cart';
import { useAuthStore } from '@/shared/stores';
import { ROUTES } from '@/shared/constants';
import { getApiErrorMessage, formatCurrency } from '@/shared/utils';
import { cn } from '@/lib/utils';
import type { ProductDetail, ProductVariant, OptionValueStatus } from '../types';
import { ProductOptionPicker } from './ProductOptionPicker';

interface ProductPurchasePanelProps {
  product: ProductDetail;
  activeVariant: ProductVariant | null;
  selectedOptions: Record<number, number>;
  onSelectOption: (productOptionId: number, valueId: number) => void;
  getOptionStatus?: (productOptionId: number, valueId: number) => OptionValueStatus;
  isAvailable?: (productOptionId: number, valueId: number) => boolean;
  onAddToCart?: (variant: ProductVariant, quantity: number) => void;
}

export function ProductPurchasePanel({
  product,
  activeVariant,
  selectedOptions,
  onSelectOption,
  getOptionStatus,
  isAvailable,
  onAddToCart,
}: ProductPurchasePanelProps) {
  const { t } = useTranslation('products');
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [prevVariantId, setPrevVariantId] = useState<number | null>(activeVariant?.id ?? null);
  const [quantity, setQuantity] = useState(() =>
    activeVariant && activeVariant.quantity > 0 ? 1 : 0
  );
  const [actionType, setActionType] = useState<'cart' | 'buy' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synchronize quantity during render when activeVariant switches (per React 19 rules)
  if (activeVariant?.id !== prevVariantId) {
    setPrevVariantId(activeVariant?.id ?? null);
    setQuantity(activeVariant && activeVariant.quantity > 0 ? 1 : 0);
  }

  const { mutate: addToCart, isPending } = useAddToCart();

  const price = activeVariant?.price ?? 0;
  const isUnavailable = !activeVariant;
  const isOutOfStock = Boolean(activeVariant && activeVariant.quantity <= 0);
  const stockCount = activeVariant?.quantity ?? 0;
  const isActionDisabled = isUnavailable || isOutOfStock;

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  };

  const handleIncrease = () => {
    if (quantity < stockCount) {
      setQuantity((prev) => prev + 1);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  };

  const handleOptionSelect = (productOptionId: number, valueId: number) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    onSelectOption(productOptionId, valueId);
  };

  const handleAddToCart = () => {
    if (!activeVariant || isActionDisabled || isPending) return;

    if (onAddToCart) {
      onAddToCart(activeVariant, quantity);
      return;
    }

    if (!isAuthenticated) {
      router.push(`${ROUTES.AUTH.LOGIN}?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setActionType('cart');

    addToCart(
      {
        productVariantId: activeVariant.id,
        quantity,
      },
      {
        onSuccess: () => {
          setActionType(null);
          setSuccessMessage(
            t('detail.addedSuccess', {
              count: quantity,
              item: quantity > 1 ? t('detail.unitItems') : t('detail.unitItem'),
            })
          );
          setTimeout(() => {
            setSuccessMessage(null);
          }, 3500);
        },
        onError: (err) => {
          setActionType(null);
          setErrorMessage(getApiErrorMessage(err, t('detail.errorAdd')));
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!activeVariant || isActionDisabled || isPending) return;

    if (!isAuthenticated) {
      router.push(`${ROUTES.AUTH.LOGIN}?returnUrl=${encodeURIComponent(ROUTES.SHOP.CART)}`);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setActionType('buy');

    addToCart(
      {
        productVariantId: activeVariant.id,
        quantity,
      },
      {
        onSuccess: () => {
          router.push(ROUTES.SHOP.CART);
        },
        onError: (err) => {
          setActionType(null);
          setErrorMessage(getApiErrorMessage(err, t('detail.errorProcess')));
        },
      }
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Brand & Category badges */}
      <div className="flex items-center gap-2">
        {product.brand?.name && (
          <Badge variant="secondary" className="font-semibold text-micro uppercase tracking-wider">
            {product.brand.name}
          </Badge>
        )}
        {product.category?.name && (
          <Badge variant="outline" className="text-micro">
            {product.category.name}
          </Badge>
        )}
      </div>

      {/* Product Title */}
      <div className="space-y-1">
        <h1 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {activeVariant?.sku ? (
            <Typography.Muted className="text-micro font-mono">
              {t('detail.sku', { sku: activeVariant.sku })}
            </Typography.Muted>
          ) : (
            <Typography.Muted className="text-micro text-amber-500 font-medium">
              {t('detail.chooseConfiguration')}
            </Typography.Muted>
          )}
          {activeVariant?.title && (
            <>
              <span className="text-muted-foreground/40 text-micro">•</span>
              <Typography.Muted className="text-micro font-medium text-foreground/80">
                {activeVariant.title}
              </Typography.Muted>
            </>
          )}
        </div>
      </div>

      {/* Pricing & Stock Status */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-muted/30 border border-border/60 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            {isUnavailable ? (
              <span className="text-xl font-bold text-muted-foreground">
                {t('detail.unavailable')}
              </span>
            ) : (
              <span className="text-xl sm:text-2xl font-black text-primary tracking-tight tabular-nums">
                {formatCurrency(price)}
              </span>
            )}
          </div>
          <Typography.Muted className="text-micro block">
            {isUnavailable
              ? t('detail.combinationNotExists')
              : t('detail.taxAndShipping')}
          </Typography.Muted>
        </div>

        <div>
          {isUnavailable ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              <AlertCircle className="size-3.5" />
              <span>{t('detail.unavailable')}</span>
            </div>
          ) : isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
              <AlertCircle className="size-3.5" />
              <span>{t('detail.outOfStock')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="size-3.5" />
              <span>{t('detail.inStock', { count: stockCount })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Option Selectors (Color, RAM, Storage, etc.) */}
      <ProductOptionPicker
        options={product.options}
        selectedOptions={selectedOptions}
        onSelectOption={handleOptionSelect}
        getOptionStatus={getOptionStatus}
        isAvailable={isAvailable}
      />

      {/* Unavailable combination alert */}
      {isUnavailable && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{t('detail.combinationNotExistsWarning')}</span>
        </div>
      )}

      {/* Quantity & CTA Action Buttons */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs sm:text-sm font-semibold text-foreground">{t('detail.quantity')}</span>
          <div className="flex items-center rounded-lg border border-border/80 bg-card p-0.5 shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="icon-2xs"
              disabled={quantity <= 1 || isActionDisabled || isPending}
              onClick={handleDecrease}
              className="size-7 rounded text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              -
            </Button>
            <span className="w-8 text-center text-xs sm:text-sm font-semibold tabular-nums">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-2xs"
              disabled={quantity >= stockCount || isActionDisabled || isPending}
              onClick={handleIncrease}
              className="size-7 rounded text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              +
            </Button>
          </div>

          {/* Show remaining quantity of chosen variant */}
          {activeVariant && (
            <span
              className={cn(
                'text-xs font-medium',
                isOutOfStock
                  ? 'text-destructive font-semibold'
                  : stockCount <= 5
                  ? 'text-amber-600 dark:text-amber-400 font-semibold'
                  : 'text-muted-foreground'
              )}
            >
              {isOutOfStock
                ? t('detail.outOfStock')
                : t('detail.available', { count: stockCount })}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <Button
            size="default"
            variant="outline"
            disabled={isActionDisabled || isPending}
            onClick={handleAddToCart}
            className="flex-1 rounded-lg h-10 text-xs sm:text-sm font-bold gap-2 shadow-2xs"
          >
            {isPending && actionType === 'cart' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t('detail.adding')}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="size-4" />
                <span>{t('detail.addToCart')}</span>
              </>
            )}
          </Button>
          <Button
            size="default"
            disabled={isActionDisabled || isPending}
            onClick={handleBuyNow}
            className="flex-1 rounded-lg h-10 text-xs sm:text-sm font-bold gap-2 shadow-xs"
          >
            {isPending && actionType === 'buy' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{t('detail.processing')}</span>
              </>
            ) : (
              <>
                <Zap className="size-4" />
                <span>{t('detail.buyNow')}</span>
              </>
            )}
          </Button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <Alert variant="success" className="animate-in fade-in slide-in-from-top-1 duration-200 py-2">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="text-xs font-medium">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1 duration-200 py-2">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-xs font-medium">{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Value Proposition & Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-border/60 text-micro sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="size-3.5 text-primary shrink-0" />
          <span>{t('detail.guaranteeGenuine')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Truck className="size-3.5 text-primary shrink-0" />
          <span>{t('detail.guaranteeFastShipping')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RotateCcw className="size-3.5 text-primary shrink-0" />
          <span>{t('detail.guaranteeReturn')}</span>
        </div>
      </div>
    </div>
  );
}
