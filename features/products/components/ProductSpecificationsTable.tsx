'use client';

import React from 'react';
import { SlidersHorizontal, Cpu, Sparkles } from 'lucide-react';
import type { ProductDetail, ProductVariant } from '../types';

interface ProductSpecificationsTableProps {
  product: ProductDetail;
  activeVariant: ProductVariant | null;
}

export function ProductSpecificationsTable({
  product,
  activeVariant,
}: ProductSpecificationsTableProps) {
  const hasBaseAttributes = product.attributes && product.attributes.length > 0;
  const hasVariantAttributes = activeVariant?.attributeValues && activeVariant.attributeValues.length > 0;

  if (!hasBaseAttributes && !hasVariantAttributes) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/70">
        No technical specifications available for this product.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Variant Hardware Configuration */}
      {hasVariantAttributes && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Cpu className="size-4" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                Hardware Configuration
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <Sparkles className="size-3" />
              Selected: {activeVariant?.title}
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs divide-y divide-border/60">
            {activeVariant?.attributeValues.map((attr, idx) => (
              <div
                key={attr.productAttributeId || idx}
                className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 text-sm ${
                  idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                }`}
              >
                <span className="font-medium text-muted-foreground w-full sm:w-1/3">
                  {attr.name}
                </span>
                <span className="font-semibold text-foreground w-full sm:w-2/3">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. General Product Base Specifications */}
      {hasBaseAttributes && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <SlidersHorizontal className="size-4" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              General Specifications
            </h3>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs divide-y divide-border/60">
            {/* Brand & Category entries */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 text-sm bg-background">
              <span className="font-medium text-muted-foreground w-full sm:w-1/3">
                Brand
              </span>
              <span className="font-semibold text-foreground w-full sm:w-2/3">
                {product.brand?.name || 'N/A'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 text-sm bg-muted/20">
              <span className="font-medium text-muted-foreground w-full sm:w-1/3">
                Category
              </span>
              <span className="font-semibold text-foreground w-full sm:w-2/3">
                {product.category?.name || 'N/A'}
              </span>
            </div>

            {/* Dynamic Attributes from product.attributes */}
            {product.attributes.map((attr, idx) => (
              <div
                key={attr.productAttributeId || idx}
                className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 text-sm ${
                  idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                }`}
              >
                <span className="font-medium text-muted-foreground w-full sm:w-1/3">
                  {attr.name}
                </span>
                <span className="font-semibold text-foreground w-full sm:w-2/3">
                  {attr.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
