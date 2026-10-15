'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('products');
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
      className={`w-full rounded-xl border border-border/70 bg-card/60 backdrop-blur-sm p-3 sm:p-3.5 shadow-2xs ${className || ''}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-border/60 mb-3">
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="size-3.5 text-primary" />
          <h2 className="font-bold text-xs sm:text-sm tracking-tight text-foreground">
            {t('search.filters.title')}
          </h2>
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-6 text-micro text-muted-foreground hover:text-destructive gap-1 px-1.5"
          >
            <RotateCcw className="size-2.5" />
            {t('search.filters.resetAll')}
          </Button>
        )}
      </div>

      <div className="space-y-4 divide-y divide-border/40">
        {/* 1. Price Range Section */}
        <div className="pt-1.5 first:pt-0">
          <Button
            type="button"
            variant="ghost"
            size="unstyled"
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
          >
            <span>{t('search.filters.priceRange')}</span>
            <ChevronDown
              className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                collapsedSections['price'] ? '-rotate-90' : ''
              }`}
            />
          </Button>

          {!collapsedSections['price'] && (
            <div className="pt-1.5">
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
          <div className="pt-3">
            <Button
              type="button"
              variant="ghost"
              size="unstyled"
              onClick={() => toggleSection('brands')}
              className="flex w-full items-center justify-between py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
            >
              <div className="flex items-center gap-1.5">
                <span>{t('search.filters.brands')}</span>
                {selectedBrandIds.length > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-primary text-micro font-bold text-primary-foreground tabular-nums">
                    {selectedBrandIds.length}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                  collapsedSections['brands'] ? '-rotate-90' : ''
                }`}
              />
            </Button>

            {!collapsedSections['brands'] && (
              <div className="pt-1.5">
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
              <div key={attr.id} className="pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="unstyled"
                  onClick={() => toggleSection(sectionKey)}
                  className="flex w-full items-center justify-between py-1.5 text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{attr.name}</span>
                    {activeValuesForAttr.length > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-micro font-bold text-primary-foreground tabular-nums">
                        {activeValuesForAttr.length}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`size-3.5 text-muted-foreground transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                  />
                </Button>

                {!isCollapsed && (
                  <div className="pt-1.5">
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
