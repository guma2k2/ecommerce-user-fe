'use client';

import React, { useState } from 'react';
import { ChevronDown, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';
import { FacetBrandGroup } from './FacetBrandGroup';
import { FacetAttributeGroup } from './FacetAttributeGroup';
import { FacetPriceRange } from './FacetPriceRange';
import { parseAttributesList } from '../utils';
import type { SearchFacets } from '../types';

interface SearchFacetSidebarProps {
  facets: SearchFacets | null;
  selectedBrandIds?: number[];
  selectedAttributes?: string[];
  minPrice?: number;
  maxPrice?: number;
  hasActiveFilters: boolean;
  onToggleBrand: (brandId: number) => void;
  onToggleAttribute: (attributeId: number, value: string) => void;
  onApplyPriceRange: (min?: number, max?: number) => void;
  onClearAll: () => void;
  className?: string;
}

export function SearchFacetSidebar({
  facets,
  selectedBrandIds = [],
  selectedAttributes = [],
  minPrice,
  maxPrice,
  hasActiveFilters,
  onToggleBrand,
  onToggleAttribute,
  onApplyPriceRange,
  onClearAll,
  className,
}: SearchFacetSidebarProps) {
  // Collapsible accordion state: default all open
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const parsedAttrMap = parseAttributesList(selectedAttributes);

  if (!facets) {
    return (
      <aside className={`w-full space-y-6 ${className || ''}`}>
        <div className="h-6 w-32 bg-muted/60 animate-pulse rounded" />
        <div className="space-y-3">
          <div className="h-4 w-24 bg-muted/50 animate-pulse rounded" />
          <div className="h-20 bg-muted/40 animate-pulse rounded-xl" />
        </div>
      </aside>
    );
  }

  return (
    <aside
      data-slot="facet-sidebar"
      className={`w-full rounded-2xl border border-border/70 bg-card/60 backdrop-blur-sm p-4 sm:p-5 shadow-xs ${className || ''}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <h2 className="font-bold text-base tracking-tight text-foreground">
            Filters
          </h2>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs text-muted-foreground hover:text-destructive gap-1 px-2"
          >
            <RotateCcw className="size-3" />
            Reset all
          </Button>
        )}
      </div>

      <div className="space-y-6 divide-y divide-border/40">
        {/* 1. Price Range Section */}
        <div className="pt-2 first:pt-0">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
          >
            <span>Price Range</span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                collapsedSections['price'] ? '-rotate-90' : ''
              }`}
            />
          </button>

          {!collapsedSections['price'] && (
            <div className="pt-2">
              <FacetPriceRange
                priceRange={facets.priceRange}
                currentMinPrice={minPrice}
                currentMaxPrice={maxPrice}
                onApplyPriceRange={onApplyPriceRange}
              />
            </div>
          )}
        </div>

        {/* 2. Brands Section */}
        {facets.brands && facets.brands.length > 0 && (
          <div className="pt-5">
            <button
              type="button"
              onClick={() => toggleSection('brands')}
              className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
            >
              <div className="flex items-center gap-1.5">
                <span>Brands</span>
                {selectedBrandIds.length > 0 && (
                  <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {selectedBrandIds.length}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                  collapsedSections['brands'] ? '-rotate-90' : ''
                }`}
              />
            </button>

            {!collapsedSections['brands'] && (
              <div className="pt-2">
                <FacetBrandGroup
                  brands={facets.brands}
                  selectedBrandIds={selectedBrandIds}
                  onToggleBrand={onToggleBrand}
                />
              </div>
            )}
          </div>
        )}

        {/* 3. Dynamic Attributes Sections */}
        {facets.attributes &&
          facets.attributes.map((attr) => {
            const sectionKey = `attr-${attr.id}`;
            const isCollapsed = collapsedSections[sectionKey];
            const activeValuesForAttr = parsedAttrMap.get(attr.id) || [];

            return (
              <div key={attr.id} className="pt-5">
                <button
                  type="button"
                  onClick={() => toggleSection(sectionKey)}
                  className="flex w-full items-center justify-between py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{attr.name}</span>
                    {activeValuesForAttr.length > 0 && (
                      <span className="flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {activeValuesForAttr.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </button>

                {!isCollapsed && (
                  <div className="pt-2">
                    <FacetAttributeGroup
                      attribute={attr}
                      selectedValues={activeValuesForAttr}
                      onToggleValue={onToggleAttribute}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </aside>
  );
}
