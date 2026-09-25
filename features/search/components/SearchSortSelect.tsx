'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import type { SearchSortOption } from '../types';

interface SearchSortSelectProps {
  value: SearchSortOption;
  onChange: (value: SearchSortOption) => void;
}

const SORT_OPTIONS: { label: string; value: SearchSortOption }[] = [
  { label: 'Most Relevant', value: 'RELEVANCE' },
  { label: 'Price: Low to High', value: 'PRICE_ASC' },
  { label: 'Price: High to Low', value: 'PRICE_DESC' },
  { label: 'Newest Arrivals', value: 'NEWEST' },
];

export function SearchSortSelect({ value, onChange }: SearchSortSelectProps) {
  return (
    <div className="relative inline-flex items-center">
      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SearchSortOption)}
        className="h-9 pl-8 pr-7 text-xs sm:text-sm font-medium rounded-xl border border-border/80 bg-background text-foreground shadow-xs hover:border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer appearance-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none text-[10px]">
        ▼
      </span>
    </div>
  );
}
