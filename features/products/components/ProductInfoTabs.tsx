'use client';

import React from 'react';
import { FileText, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent, Typography } from '@/components/ui';
import type { ProductDetail, ProductVariant } from '../types';
import { ProductSpecificationsTable } from './ProductSpecificationsTable';

interface ProductInfoTabsProps {
  product: ProductDetail;
  activeVariant: ProductVariant | null;
}

export function ProductInfoTabs({ product, activeVariant }: ProductInfoTabsProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
      <Tabs defaultValue="description" className="space-y-6">
        {/* Tab Navigation Header */}
        <div className="border-b border-border/60 pb-3">
          <TabsList className="bg-transparent p-0 h-auto gap-2 flex-wrap justify-start">
            <TabsTrigger
              value="description"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[active]:bg-primary data-[active]:text-primary-foreground data-[active]:shadow-xs aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-xs transition-all"
            >
              <FileText className="size-4" />
              <span>Description</span>
            </TabsTrigger>

            <TabsTrigger
              value="specifications"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[active]:bg-primary data-[active]:text-primary-foreground data-[active]:shadow-xs aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-xs transition-all"
            >
              <SlidersHorizontal className="size-4" />
              <span>Specifications</span>
            </TabsTrigger>

            <TabsTrigger
              value="warranty"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/60 data-[active]:bg-primary data-[active]:text-primary-foreground data-[active]:shadow-xs aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:shadow-xs transition-all"
            >
              <ShieldCheck className="size-4" />
              <span>Warranty & Policy</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Description Content */}
        <TabsContent value="description" className="mt-0 focus-visible:outline-none">
          {product.description ? (
            <div
              className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mb-2 [&_strong]:text-foreground [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline [&_img]:rounded-xl [&_img]:my-4 [&_img]:max-w-full [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:p-2 [&_td]:border [&_td]:p-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <Typography.Muted>
              No detailed product description available.
            </Typography.Muted>
          )}
        </TabsContent>

        {/* Specifications Content */}
        <TabsContent value="specifications" className="mt-0 focus-visible:outline-none">
          <ProductSpecificationsTable product={product} activeVariant={activeVariant} />
        </TabsContent>

        {/* Warranty & Policy Content */}
        <TabsContent value="warranty" className="mt-0 focus-visible:outline-none">
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <Typography.H4 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                Genuine Official Warranty
              </Typography.H4>
              <Typography.P affects="removeMargin">
                This product is guaranteed 100% authentic and comes with a 12-month manufacturer warranty directly handled by authorized service centers.
              </Typography.P>
            </div>
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <Typography.H4 className="text-base font-bold text-foreground">
                Return & Replacement Policy
              </Typography.H4>
              <Typography.P affects="removeMargin">
                Free 30-day return policy for any manufacturer defects. The item must be returned in its original condition with complete packaging and accessories.
              </Typography.P>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
