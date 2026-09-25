'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Package, Search } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Badge, Skeleton } from '@/components/ui';
import { formatPriceValue } from '../utils';
import type { ProductSuggestionItem } from '../types';

interface SearchSuggestionDropdownProps {
  suggestions: ProductSuggestionItem[];
  isLoading: boolean;
  keyword: string;
  selectedIndex: number;
  onSelectSuggestion: (item: ProductSuggestionItem) => void;
  onSubmitSearch: () => void;
}

export function SearchSuggestionDropdown({
  suggestions,
  isLoading,
  keyword,
  selectedIndex,
  onSelectSuggestion,
  onSubmitSearch,
}: SearchSuggestionDropdownProps) {
  if (!keyword.trim()) return null;

  return (
    <div
      data-slot="suggestion-dropdown"
      className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl transition-all animate-in fade-in-50 zoom-in-95 duration-200"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2.5 text-xs text-muted-foreground bg-muted/30">
        <span className="font-medium tracking-wide uppercase">
          Product Suggestions
        </span>
        <span>Press <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground">↵</kbd> to search</span>
      </div>

      {/* Content list */}
      <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-border/30">
        {isLoading ? (
          <div className="space-y-3 p-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((item, index) => {
            const isSelected = selectedIndex === index;
            return (
              <Link
                key={item.id}
                href={ROUTES.SHOP.PRODUCT_DETAIL(item.slug || String(item.id))}
                onClick={() => onSelectSuggestion(item)}
                className={`group flex items-center gap-3.5 rounded-xl p-2.5 transition-colors ${
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/70 text-foreground'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/50">
                  {item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <Package className="size-5 text-muted-foreground" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </p>
                    {item.categoryName && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {item.categoryName}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-primary mt-0.5">
                    {formatPriceValue(item.price)}
                  </p>
                </div>

                <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary" />
              </Link>
            );
          })
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            <Search className="size-8 mx-auto mb-2 opacity-30" />
            <p>No product suggestions found for &ldquo;<span className="font-semibold text-foreground">{keyword}</span>&rdquo;</p>
            <p className="text-xs mt-1">Press Enter to view all general search results</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <button
        type="button"
        onClick={onSubmitSearch}
        className="flex w-full items-center justify-between border-t border-border/50 bg-muted/40 px-4 py-3 text-xs font-medium text-foreground hover:bg-muted/80 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Search className="size-3.5 text-primary" />
          <span>View all search results for &ldquo;<strong className="text-primary">{keyword}</strong>&rdquo;</span>
        </span>
        <ArrowRight className="size-4 text-muted-foreground" />
      </button>
    </div>
  );
}
