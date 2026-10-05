'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '@/components/ui';
import type { ActiveFilterItem, SearchFacets } from '../types';

interface ActiveFilterChipsProps {
  activeFilters: ActiveFilterItem[];
  facets: SearchFacets | null;
  onRemoveFilter: (filter: ActiveFilterItem) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  activeFilters,
  facets,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) {
  const { t } = useTranslation('products');

  if (!activeFilters || activeFilters.length === 0) return null;

  // Helper to resolve brand name from ID
  const getFilterDisplayLabel = (filter: ActiveFilterItem): string => {
    if (filter.type === 'brand' && facets?.brands) {
      const match = facets.brands.find((b) => b.id === filter.value);
      if (match) return `${t('search.filters.brands')}: ${match.name}`;
    }
    if (filter.type === 'attribute' && facets?.attributes && filter.attributeId) {
      const attrMatch = facets.attributes.find((a) => a.id === filter.attributeId);
      if (attrMatch) return `${attrMatch.name}: ${filter.value}`;
    }
    if (filter.type === 'price') {
      return `${t('search.card.price')}: ${filter.label}`;
    }
    return filter.label;
  };

  return (
    <div
      data-slot="active-filter-chips"
      className="flex flex-wrap items-center gap-2 pt-1 pb-3"
    >
      <span className="text-xs font-medium text-muted-foreground mr-1">
        {t('search.filters.activeFilters')}
      </span>

      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 pl-2.5 pr-1.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors animate-in fade-in zoom-in-95 duration-150"
        >
          <span>{getFilterDisplayLabel(filter)}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-2xs"
            onClick={() => onRemoveFilter(filter)}
            className="rounded-full text-primary/70 hover:text-primary hover:bg-primary/20 transition-colors"
            title={`Remove ${filter.label}`}
          >
            <X className="size-3" />
            <span className="sr-only">Remove</span>
          </Button>
        </span>
      ))}

      <Button
        type="button"
        variant="link"
        size="unstyled"
        onClick={onClearAll}
        className="text-xs font-semibold text-muted-foreground hover:text-destructive underline-offset-4 ml-1 transition-colors"
      >
        {t('search.filters.clearAll')}
      </Button>
    </div>
  );
}
