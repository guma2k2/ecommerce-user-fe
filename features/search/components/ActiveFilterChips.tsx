'use client';

import React from 'react';
import { X } from 'lucide-react';
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
  if (!activeFilters || activeFilters.length === 0) return null;

  // Helper to resolve brand name from ID
  const getFilterDisplayLabel = (filter: ActiveFilterItem): string => {
    if (filter.type === 'brand' && facets?.brands) {
      const match = facets.brands.find((b) => b.id === filter.value);
      if (match) return `Brand: ${match.name}`;
    }
    if (filter.type === 'attribute' && facets?.attributes && filter.attributeId) {
      const attrMatch = facets.attributes.find((a) => a.id === filter.attributeId);
      if (attrMatch) return `${attrMatch.name}: ${filter.value}`;
    }
    if (filter.type === 'price') {
      return `Price: ${filter.label}`;
    }
    return filter.label;
  };

  return (
    <div
      data-slot="active-filter-chips"
      className="flex flex-wrap items-center gap-2 pt-1 pb-3"
    >
      <span className="text-xs font-medium text-muted-foreground mr-1">
        Active Filters:
      </span>

      {activeFilters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 pl-2.5 pr-1.5 py-0.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors animate-in fade-in zoom-in-95 duration-150"
        >
          <span>{getFilterDisplayLabel(filter)}</span>
          <button
            type="button"
            onClick={() => onRemoveFilter(filter)}
            className="rounded-full p-0.5 text-primary/70 hover:text-primary hover:bg-primary/20 transition-colors"
            title={`Remove ${filter.label}`}
          >
            <X className="size-3" />
            <span className="sr-only">Remove</span>
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-semibold text-muted-foreground hover:text-destructive underline-offset-4 hover:underline ml-1 transition-colors"
      >
        Clear all
      </button>
    </div>
  );
}
