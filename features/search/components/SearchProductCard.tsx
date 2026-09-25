'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Badge } from '@/components/ui';
import { formatPriceRange } from '../utils';
import type { ProductSearchItem } from '../types';

interface SearchProductCardProps {
  product: ProductSearchItem;
}

export function SearchProductCard({ product }: SearchProductCardProps) {
  const detailUrl = ROUTES.SHOP.PRODUCT_DETAIL(product.slug || String(product.id));

  return (
    <div
      data-slot="product-card"
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1"
    >
      <div>
        {/* Thumbnail Image Container */}
        <Link href={detailUrl} className="block relative aspect-square w-full overflow-hidden bg-muted/40">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <Package className="size-12" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {product.brandName ? (
              <Badge variant="secondary" className="text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md bg-background/80 shadow-2xs">
                {product.brandName}
              </Badge>
            ) : <span />}

            {product.categoryName && (
              <Badge variant="outline" className="text-[10px] font-medium backdrop-blur-md bg-background/80">
                {product.categoryName}
              </Badge>
            )}
          </div>
        </Link>

        {/* Content Body */}
        <div className="p-4 space-y-2">
          <Link href={detailUrl}>
            <h3
              title={product.name}
              className="font-semibold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug"
            >
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-border/40 mt-3 pt-3">
        <div>
          <span className="text-[11px] text-muted-foreground block font-medium">Price</span>
          <p className="font-bold text-sm sm:text-base text-primary">
            {formatPriceRange(product.minPrice, product.maxPrice)}
          </p>
        </div>

        <Link
          href={detailUrl}
          className="flex size-8.5 items-center justify-center rounded-xl bg-muted/80 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
          aria-label={`View details for ${product.name}`}
        >
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
