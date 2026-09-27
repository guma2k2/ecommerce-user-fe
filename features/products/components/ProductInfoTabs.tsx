'use client';

import React, { useState } from 'react';
import { FileText, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import type { ProductDetail, ProductVariant } from '../types';
import { ProductSpecificationsTable } from './ProductSpecificationsTable';

interface ProductInfoTabsProps {
  product: ProductDetail;
  activeVariant: ProductVariant | null;
}

export function ProductInfoTabs({ product, activeVariant }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'warranty'>('description');

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs space-y-6">
      {/* Tab Navigation Header */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('description')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'description'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <FileText className="size-4" />
          <span>Description</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'specifications'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <SlidersHorizontal className="size-4" />
          <span>Specifications</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('warranty')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'warranty'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
          }`}
        >
          <ShieldCheck className="size-4" />
          <span>Warranty & Policy</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'description' && (
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
            <p className="whitespace-pre-line text-sm sm:text-base">
              {product.description || 'No detailed product description available.'}
            </p>
          </div>
        )}

        {activeTab === 'specifications' && (
          <ProductSpecificationsTable product={product} activeVariant={activeVariant} />
        )}

        {activeTab === 'warranty' && (
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Genuine Official Warranty
              </h4>
              <p>
                This product is guaranteed 100% authentic and comes with a 12-month manufacturer warranty directly handled by authorized service centers.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <h4 className="font-bold text-foreground">Return & Replacement Policy</h4>
              <p>
                Free 30-day return policy for any manufacturer defects. The item must be returned in its original condition with complete packaging and accessories.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
