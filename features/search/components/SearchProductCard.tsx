'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Package, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Badge } from '@/components/ui';
import { formatPriceRange } from '../utils';
import type { ProductSearchItem } from '../types';

interface SearchProductCardProps {
  product: ProductSearchItem;
}

export function SearchProductCard({ product }: SearchProductCardProps) {
  const { t } = useTranslation('products');
  const basePath = ROUTES.SHOP.PRODUCT_DETAIL(product.slug || String(product.id));
  const detailUrl = product.defaultVariantId ? `${basePath}?variant=${product.defaultVariantId}` : basePath;

  return (
    <div
      data-slot="product-card"
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border/70 bg-card/70 backdrop-blur-xs transition-all duration-200 hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5"
    >
      <div>
        {/* Thumbnail Image Container */}
        <Link href={detailUrl} className="block relative aspect-square w-full overflow-hidden bg-muted/30">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-104"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
              <Package className="size-10" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
            {product.brandName ? (
              <Badge variant="secondary" size="sm" className="backdrop-blur-md bg-background/85 shadow-2xs">
                {product.brandName}
              </Badge>
            ) : <span />}

            {product.categoryName && (
              <Badge variant="outline" size="sm" className="backdrop-blur-md bg-background/85">
                {product.categoryName}
              </Badge>
            )}
          </div>
        </Link>

        {/* Content Body */}
        <div className="p-2.5 space-y-1">
          <Link href={detailUrl}>
            <h3
              title={product.name}
              className="font-medium text-xs sm:text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-snug min-h-[2.4rem]"
            >
              {product.name}
            </h3>
          </Link>
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-2.5 pt-0 flex items-center justify-between border-t border-border/30 mt-1 pt-2">
        <div>
          <span className="text-micro text-muted-foreground block font-medium uppercase tracking-wider">{t('search.card.price')}</span>
          <p className="font-bold text-sm sm:text-base text-primary tabular-nums">
            {formatPriceRange(product.minPrice, product.maxPrice)}
          </p>
        </div>

        <Link
          href={detailUrl}
          className="flex size-7 items-center justify-center rounded-lg bg-muted/70 text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"
          aria-label={t('search.card.viewDetails', { name: product.name })}
        >
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
}
