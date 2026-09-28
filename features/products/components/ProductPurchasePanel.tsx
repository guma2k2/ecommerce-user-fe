'use client';

import React, { useState } from 'react';
import {
  ShoppingCart,
  Zap,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import type { ProductDetail, ProductVariant, OptionValueStatus } from '../types';
import { ProductOptionPicker } from './ProductOptionPicker';

interface ProductPurchasePanelProps {
  product: ProductDetail;
  activeVariant: ProductVariant | null;
  selectedOptions: Record<number, number>;
  onSelectOption: (productOptionId: number, valueId: number) => void;
  getOptionStatus?: (productOptionId: number, valueId: number) => OptionValueStatus;
  isAvailable?: (productOptionId: number, valueId: number) => boolean;
}

export function ProductPurchasePanel({
  product,
  activeVariant,
  selectedOptions,
  onSelectOption,
  getOptionStatus,
  isAvailable,
}: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);

  const price = activeVariant?.price ?? 0;
  const isUnavailable = !activeVariant;
  const isOutOfStock = Boolean(activeVariant && activeVariant.quantity <= 0);
  const stockCount = activeVariant?.quantity ?? 0;
  const isActionDisabled = isUnavailable || isOutOfStock;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleIncrease = () => {
    if (quantity < stockCount) setQuantity((prev) => prev + 1);
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
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
          {product.name}
        </h1>
        {activeVariant?.sku ? (
          <p className="text-xs text-muted-foreground font-mono">
            SKU: {activeVariant.sku}
          </p>
        ) : (
          <p className="text-xs text-amber-500 font-medium">
            Please choose an available configuration
          </p>
        )}
      </div>

      {/* Pricing & Stock Status */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            {isUnavailable ? (
              <span className="text-2xl font-bold text-muted-foreground">
                Unavailable
              </span>
            ) : (
              <span className="text-3xl font-black text-primary tracking-tight">
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">
            {isUnavailable
              ? 'Combination does not exist'
              : 'Tax included. Free shipping on eligible orders.'}
          </span>
        </div>

        <div>
          {isUnavailable ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full">
              <AlertCircle className="size-4" />
              <span>Unavailable</span>
            </div>
          ) : isOutOfStock ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-3 py-1.5 rounded-full">
              <AlertCircle className="size-4" />
              <span>Out of Stock</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="size-4" />
              <span>In Stock ({stockCount})</span>
            </div>
          )}
        </div>
      </div>

      {/* Option Selectors (Color, RAM, Storage, etc.) */}
      <ProductOptionPicker
        options={product.options}
        selectedOptions={selectedOptions}
        onSelectOption={onSelectOption}
        getOptionStatus={getOptionStatus}
        isAvailable={isAvailable}
      />

      {/* Unavailable combination alert */}
      {isUnavailable && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-center gap-2">
          <AlertCircle className="size-4 shrink-0" />
          <span>This combination of options does not exist. Please select another variant.</span>
        </div>
      )}

      {/* Quantity & CTA Action Buttons */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Quantity:</span>
          <div className="flex items-center rounded-xl border border-border/80 bg-card p-1 shadow-2xs">
            <button
              type="button"
              disabled={quantity <= 1 || isActionDisabled}
              onClick={handleDecrease}
              className="flex size-8 items-center justify-center rounded-lg text-sm font-bold hover:bg-muted text-muted-foreground transition-colors disabled:opacity-40"
            >
              -
            </button>
            <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
            <button
              type="button"
              disabled={quantity >= stockCount || isActionDisabled}
              onClick={handleIncrease}
              className="flex size-8 items-center justify-center rounded-lg text-sm font-bold hover:bg-muted text-muted-foreground transition-colors disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            size="lg"
            variant="outline"
            disabled={isActionDisabled}
            className="flex-1 rounded-xl h-12 text-sm font-bold gap-2 shadow-2xs"
          >
            <ShoppingCart className="size-4" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            disabled={isActionDisabled}
            className="flex-1 rounded-xl h-12 text-sm font-bold gap-2 shadow-md"
          >
            <Zap className="size-4" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Value Proposition & Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span>100% Genuine Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-primary shrink-0" />
          <span>Fast & Free Delivery</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-primary shrink-0" />
          <span>30-Day Hassle-Free Return</span>
        </div>
      </div>
    </div>
  );
}
