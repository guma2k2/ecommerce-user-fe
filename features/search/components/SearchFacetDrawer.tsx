'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui';
import { SearchFacetSidebar } from './SearchFacetSidebar';
import type { SearchFacets } from '../types';

interface SearchFacetDrawerProps {
  facets: SearchFacets | null;
  selectedBrandIds?: number[];
  selectedAttributes?: string[];
  minPrice?: number;
  maxPrice?: number;
  activeFilterCount: number;
  totalElements?: number;
  onToggleBrand: (brandId: number) => void;
  onToggleAttribute: (attributeId: number, value: string) => void;
  onApplyPriceRange: (min?: number, max?: number) => void;
  onClearAll: () => void;
}

export function SearchFacetDrawer({
  facets,
  selectedBrandIds,
  selectedAttributes,
  minPrice,
  maxPrice,
  activeFilterCount,
  totalElements,
  onToggleBrand,
  onToggleAttribute,
  onApplyPriceRange,
  onClearAll,
}: SearchFacetDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="h-9 gap-2 rounded-xl border-border/80 font-medium md:hidden"
      >
        <SlidersHorizontal className="size-3.5 text-primary" />
        <span>Filters</span>
        {activeFilterCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>

      <SheetContent side="left" className="w-[85vw] max-w-sm p-0 flex flex-col">
        <SheetHeader className="px-5 py-4 border-b border-border/60">
          <div className="flex items-center justify-between pr-8">
            <SheetTitle className="flex items-center gap-2 text-base font-bold">
              <SlidersHorizontal className="size-4 text-primary" />
              <span>Filters</span>
            </SheetTitle>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-4">
          <SearchFacetSidebar
            facets={facets}
            selectedBrandIds={selectedBrandIds}
            selectedAttributes={selectedAttributes}
            minPrice={minPrice}
            maxPrice={maxPrice}
            hasActiveFilters={activeFilterCount > 0}
            onToggleBrand={onToggleBrand}
            onToggleAttribute={onToggleAttribute}
            onApplyPriceRange={onApplyPriceRange}
            onClearAll={onClearAll}
            className="border-0 shadow-none p-0 bg-transparent"
          />
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 border-t border-border/60 bg-background/95 backdrop-blur-sm">
          <Button
            type="button"
            className="w-full font-semibold"
            onClick={() => setOpen(false)}
          >
            Show {totalElements !== undefined ? `${totalElements} Results` : 'Results'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
    </>
  );
}
