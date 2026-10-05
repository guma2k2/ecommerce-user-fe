'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Trash2, AlertCircle } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { formatCurrency } from '@/shared/utils';
import { ROUTES } from '@/shared/constants';
import { CartQuantityStepper } from './CartQuantityStepper';
import { useUpdateCartQuantity, useDeleteCartItem } from '../hooks';
import type { CartItem } from '../types';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { t } = useTranslation('cart');
  const { variant, quantity, subtotal, cartId } = item;
  const updateQuantityMutation = useUpdateCartQuantity();
  const deleteItemMutation = useDeleteCartItem();

  const isUpdating = updateQuantityMutation.isPending;
  const isDeleting = deleteItemMutation.isPending;
  const isActionDisabled = isUpdating || isDeleting;

  const isOutOfStock = variant.stockQuantity <= 0;
  const isLowStock = variant.stockQuantity > 0 && variant.stockQuantity < 5;
  const isExceeded = quantity > variant.stockQuantity;

  const handleQuantityChange = (newQty: number) => {
    if (newQty === quantity) return;
    updateQuantityMutation.mutate({
      cartId,
      quantity: newQty,
    });
  };

  const handleDelete = () => {
    deleteItemMutation.mutate(cartId);
  };

  const productUrl = ROUTES.SHOP.PRODUCT_DETAIL(variant.productSlug || String(variant.productId));

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border/60 bg-card/70 hover:border-border transition-colors">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Link
          href={productUrl}
          className="relative size-20 sm:size-24 rounded-lg overflow-hidden bg-muted/60 shrink-0 border border-border/40 group"
        >
          {variant.thumbnailUrl ? (
            <Image
              src={variant.thumbnailUrl}
              alt={variant.productName}
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="size-full flex items-center justify-center text-xs text-muted-foreground">
              {t('item.noImage')}
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1 space-y-1">
          <Link
            href={productUrl}
            className="text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-2"
          >
            {variant.productName}
          </Link>

          {/* Variant Options Badges (e.g. Color: Space Black, Storage: 256GB) */}
          {variant.options && variant.options.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 py-0.5">
              {variant.options.map((opt) => (
                <span
                  key={opt.id || `${opt.name}-${opt.value}`}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/70 text-muted-foreground border border-border/50"
                >
                  <span className="text-foreground/75 font-semibold mr-1">{opt.name}:</span>
                  {opt.value}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {variant.sku && <span>{t('item.sku', { sku: variant.sku })}</span>}
            <span>•</span>
            <span className="font-medium text-foreground">{formatCurrency(variant.price)}</span>
          </div>

          {/* Stock Badges */}
          <div className="pt-0.5">
            {isOutOfStock ? (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                {t('item.outOfStock')}
              </Badge>
            ) : isExceeded ? (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0 flex items-center gap-1">
                <AlertCircle className="size-3" />
                {t('item.onlyAvailable', { count: variant.stockQuantity })}
              </Badge>
            ) : isLowStock ? (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-amber-600 bg-amber-500/10 border-amber-500/20">
                {t('item.onlyLeft', { count: variant.stockQuantity })}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      {/* Stepper, Subtotal & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
        <div className="flex flex-col items-start sm:items-end gap-1">
          <CartQuantityStepper
            quantity={quantity}
            maxStock={Math.max(1, variant.stockQuantity)}
            disabled={isActionDisabled || isOutOfStock}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        <div className="text-right min-w-24">
          <span className="text-sm sm:text-base font-bold text-foreground">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={isActionDisabled}
          onClick={handleDelete}
          aria-label={t('item.removeAria', { name: variant.productName })}
          className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
