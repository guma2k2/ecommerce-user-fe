'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Slider } from '@/components/ui';
import { formatPriceValue } from '../utils';
import type { PriceRangeFacet } from '../types';

interface FacetPriceRangeProps {
  priceRange?: PriceRangeFacet | null;
  currentMinPrice?: number;
  currentMaxPrice?: number;
  onApplyPriceRange: (min?: number, max?: number) => void;
}

export function FacetPriceRange({
  priceRange,
  currentMinPrice,
  currentMaxPrice,
  onApplyPriceRange,
}: FacetPriceRangeProps) {
  const { t } = useTranslation('products');
  const globalMin = Math.floor(priceRange?.minPrice ?? 0);
  const globalMax = Math.ceil(priceRange?.maxPrice ?? 5000);

  const effectiveMin = currentMinPrice !== undefined ? currentMinPrice : globalMin;
  const effectiveMax = currentMaxPrice !== undefined ? currentMaxPrice : globalMax;

  // Track slider range with live drag updates
  const [sliderRange, setSliderRange] = useState<[number, number]>([effectiveMin, effectiveMax]);
  const [prevProps, setPrevProps] = useState({ min: currentMinPrice, max: currentMaxPrice });

  // Sync state during render when props change (React 19 recommended pattern)
  if (prevProps.min !== currentMinPrice || prevProps.max !== currentMaxPrice) {
    setPrevProps({ min: currentMinPrice, max: currentMaxPrice });
    setSliderRange([effectiveMin, effectiveMax]);
  }

  const handleSliderChange = (vals: number | readonly number[]) => {
    if (Array.isArray(vals) && vals.length >= 2) {
      setSliderRange([vals[0], vals[1]]);
    }
  };

  const handleSliderCommit = (vals: number | readonly number[]) => {
    if (Array.isArray(vals) && vals.length >= 2) {
      onApplyPriceRange(vals[0], vals[1]);
    }
  };

  const handlePreset = (min?: number, max?: number) => {
    onApplyPriceRange(min, max);
  };

  const hasFilter = currentMinPrice !== undefined || currentMaxPrice !== undefined;

  // Preset brackets based on available price range
  const presets = [
    { label: t('search.filters.under', { price: '$500' }), min: undefined, max: 500 },
    { label: '$500 - $1,000', min: 500, max: 1000 },
    { label: '$1,000 - $2,000', min: 1000, max: 2000 },
    { label: t('search.filters.over', { price: '$2,000' }), min: 2000, max: undefined },
  ];

  return (
    <div className="space-y-3.5">
      {/* Slider component */}
      {globalMax > globalMin && (
        <div className="px-1 pt-1">
          <Slider
            min={globalMin}
            max={globalMax}
            step={10}
            value={sliderRange}
            onValueChange={handleSliderChange}
            onValueCommitted={handleSliderCommit}
          />
          <div className="flex justify-between items-center text-xs mt-1.5 tabular-nums">
            <span className="font-medium text-foreground">{formatPriceValue(sliderRange[0])}</span>
            <span className="font-medium text-foreground">{formatPriceValue(sliderRange[1])}</span>
          </div>
        </div>
      )}

      {/* Filter Reset Button if active */}
      {hasFilter && (
        <div className="flex justify-end pt-0.5">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => handlePreset(undefined, undefined)}
            className="h-6 px-2 text-micro text-muted-foreground hover:text-foreground"
          >
            {t('search.filters.reset')}
          </Button>
        </div>
      )}

      {/* Quick Presets */}
      <div className="space-y-1.5 pt-2 border-t border-border/50">
        <span className="text-xs font-medium text-muted-foreground block mb-1">
          {t('search.filters.quickRanges')}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => {
            const isSelected =
              currentMinPrice === p.min && currentMaxPrice === p.max;
            return (
              <Button
                key={p.label}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="xs"
                onClick={() => handlePreset(p.min, p.max)}
                className={`px-2.5 py-1 rounded-lg text-xs h-7 font-normal transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary font-medium shadow-none'
                    : 'border-border/60 hover:bg-muted/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                {p.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
