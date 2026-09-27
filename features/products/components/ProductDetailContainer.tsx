'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/components/ui';
import { useProductDetail, useVariantSelection } from '../hooks';
import { ProductMediaGallery } from './ProductMediaGallery';
import { ProductPurchasePanel } from './ProductPurchasePanel';
import { ProductInfoTabs } from './ProductInfoTabs';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

interface ProductDetailContainerProps {
  slug: string;
}

export function ProductDetailContainer({ slug }: ProductDetailContainerProps) {
  const { data: product, isLoading, isError } = useProductDetail(slug);

  const {
    selectedOptions,
    selectedVariant,
    selectOptionValue,
    isOptionValueAvailable,
  } = useVariantSelection(product ?? ({} as any));

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-xl space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The product you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href={ROUTES.SHOP.SEARCH}>
          <Button className="rounded-xl mt-2 gap-2">
            <ArrowLeft className="size-4" />
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap pb-1">
        <Link href={ROUTES.HOME} className="flex items-center gap-1 hover:text-foreground transition-colors">
          <Home className="size-3.5" />
          <span>Home</span>
        </Link>
        <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />

        {product.category?.name && (
          <>
            <Link
              href={`${ROUTES.SHOP.SEARCH}?category_id=${product.category.id}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/60 shrink-0" />
          </>
        )}

        <span className="font-semibold text-foreground truncate max-w-xs sm:max-w-md">
          {product.name}
        </span>
      </nav>

      {/* Top 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Column: Media Gallery */}
        <ProductMediaGallery
          medias={product.medias}
          activeVariant={selectedVariant}
          productName={product.name}
        />

        {/* Right Column: Purchase Panel */}
        <ProductPurchasePanel
          product={product}
          activeVariant={selectedVariant}
          selectedOptions={selectedOptions}
          onSelectOption={selectOptionValue}
          isAvailable={isOptionValueAvailable}
        />
      </div>

      {/* Bottom Tabs: Description, Technical Specifications, Policy */}
      <ProductInfoTabs product={product} activeVariant={selectedVariant} />
    </div>
  );
}
