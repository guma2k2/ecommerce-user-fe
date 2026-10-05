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

  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<'cart' | 'buy' | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    <div className="flex flex-col space-y-6">
      {/* Brand & Category badges */}
      <div className="flex items-center gap-2">
        {product.brand?.name && (
          <Badge variant="secondary" className="font-semibold text-xs uppercase tracking-wider">
            {product.brand.name}
          </Badge>
        )}
        {product.category?.name && (
          <Badge variant="outline" className="text-xs">
            {product.category.name}
          </Badge>
        )}
      </div>

      {/* Product Title */}
      <div className="space-y-1.5">
        <Typography.H1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
          {product.name}
        </Typography.H1>
        {activeVariant?.sku ? (
          <Typography.Muted className="text-xs font-mono">
            {t('detail.sku', { sku: activeVariant.sku })}
          </Typography.Muted>
        ) : (
          <Typography.Muted className="text-xs text-amber-500 font-medium">
            {t('detail.chooseConfiguration')}
          </Typography.Muted>
        )}
      </div>

      {/* Pricing & Stock Status */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            {isUnavailable ? (
              <Typography.Large className="text-2xl font-bold text-muted-foreground">
                {t('detail.unavailable')}
              </Typography.Large>
            ) : (
              <Typography.Tabular className="text-3xl font-black text-primary tracking-tight">
                {formatCurrency(price)}
              </Typography.Tabular>
            )}
          </div>
          <Typography.Muted className="text-[11px] block">
            {isUnavailable
              ? t('detail.combinationNotExists')
              : t('detail.taxAndShipping')}
          </Typography.Muted>
        </div>

        <div>
          {isUnavailable ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
              <AlertCircle className="size-4" />
              <span>{t('detail.unavailable')}</span>
            </div>
          ) : isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
              <AlertCircle className="size-4" />
              <span>{t('detail.outOfStock')}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="size-4" />
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
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>{t('detail.combinationNotExistsWarning')}</span>
        </div>
      )}

      {/* Quantity & CTA Action Buttons */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">{t('detail.quantity')}</span>
          <div className="flex items-center rounded-xl border border-border/80 bg-card p-1 shadow-2xs">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={quantity <= 1 || isActionDisabled || isPending}
              onClick={handleDecrease}
              className="size-8 rounded-lg text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              -
            </Button>
            <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={quantity >= stockCount || isActionDisabled || isPending}
              onClick={handleIncrease}
              className="size-8 rounded-lg text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              +
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="lg"
            variant="outline"
            disabled={isActionDisabled || isPending}
            onClick={handleAddToCart}
            className="flex-1 rounded-xl h-12 text-sm font-bold gap-2 shadow-2xs"
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
            size="lg"
            disabled={isActionDisabled || isPending}
            onClick={handleBuyNow}
            className="flex-1 rounded-xl h-12 text-sm font-bold gap-2 shadow-md"
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
          <Alert variant="success" className="animate-in fade-in slide-in-from-top-1 duration-200">
            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            <AlertDescription className="font-medium">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="size-4" />
            <AlertDescription className="font-medium">{errorMessage}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Value Proposition & Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span>{t('detail.guaranteeGenuine')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-primary shrink-0" />
          <span>{t('detail.guaranteeFastShipping')}</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-primary shrink-0" />
          <span>{t('detail.guaranteeReturn')}</span>
        </div>
      </div>
    </div>
  );
}
