'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Checkbox } from '@/components/ui';
import type { FacetBrand } from '../types';

interface FacetBrandGroupProps {
  brands: FacetBrand[];
  selectedBrandIds?: number[];
  onToggleBrand: (brandId: number) => void;
}

export function FacetBrandGroup({
  brands,
  selectedBrandIds = [],
  onToggleBrand,
}: FacetBrandGroupProps) {
  const [filterText, setFilterText] = useState('');

  const filteredBrands = useMemo(() => {
    if (!filterText.trim()) return brands;
    const lower = filterText.toLowerCase();
    return brands.filter((b) => b.name.toLowerCase().includes(lower));
  }, [brands, filterText]);

  if (!brands || brands.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Brand Search Input if there are many brands */}
      {brands.length > 6 && (
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search brands..."
            className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-border/70 bg-muted/30 placeholder:text-muted-foreground/60 focus:bg-background focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      )}

      {/* Brands List */}
      <div className="max-h-52 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
        {filteredBrands.length > 0 ? (
          filteredBrands.map((brand) => {
            const isChecked = selectedBrandIds.includes(brand.id);
            return (
              <label
                key={brand.id}
                className="flex items-center justify-between gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-muted/60 transition-colors cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() => onToggleBrand(brand.id)}
                  />
                  <span
                    className={`truncate text-xs sm:text-sm transition-colors ${
                      isChecked
                        ? 'font-semibold text-primary'
                        : 'text-foreground/90 group-hover:text-foreground'
                    }`}
                  >
                    {brand.name}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md font-mono">
                  {brand.count}
                </span>
              </label>
            );
          })
        ) : (
          <p className="text-xs text-muted-foreground py-2 text-center">
            No brands found
          </p>
        )}
      </div>
    </div>
  );
}
