'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Slider } from '@/components/ui';
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

  const [minInput, setMinInput] = useState<string>(
    currentMinPrice !== undefined ? String(currentMinPrice) : ''
  );
  const [maxInput, setMaxInput] = useState<string>(
    currentMaxPrice !== undefined ? String(currentMaxPrice) : ''
  );

  const [prevMin, setPrevMin] = useState(currentMinPrice);
  const [prevMax, setPrevMax] = useState(currentMaxPrice);

  if (currentMinPrice !== prevMin) {
    setPrevMin(currentMinPrice);
    setMinInput(currentMinPrice !== undefined ? String(currentMinPrice) : '');
  }

  if (currentMaxPrice !== prevMax) {
    setPrevMax(currentMaxPrice);
    setMaxInput(currentMaxPrice !== undefined ? String(currentMaxPrice) : '');
  }

  const sliderValue = [
    currentMinPrice !== undefined ? currentMinPrice : globalMin,
    currentMaxPrice !== undefined ? currentMaxPrice : globalMax,
  ];

  const handleApply = () => {
    const min = minInput !== '' ? parseFloat(minInput) : undefined;
    const max = maxInput !== '' ? parseFloat(maxInput) : undefined;
    onApplyPriceRange(min, max);
  };

  const handlePreset = (min?: number, max?: number) => {
    setMinInput(min !== undefined ? String(min) : '');
    setMaxInput(max !== undefined ? String(max) : '');
    onApplyPriceRange(min, max);
  };

  const handleSliderChange = (vals: number | readonly number[]) => {
    if (Array.isArray(vals) && vals.length >= 2) {
      setMinInput(String(vals[0]));
      setMaxInput(String(vals[1]));
    }
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
    <div className="space-y-4">
      {/* Slider component */}
      {globalMax > globalMin && (
        <div className="px-1 pt-2">
          <Slider
            min={globalMin}
            max={globalMax}
            step={10}
            value={sliderValue}
            onValueChange={handleSliderChange}
            onValueCommitted={(vals) => {
              if (Array.isArray(vals) && vals.length >= 2) {
                onApplyPriceRange(vals[0], vals[1]);
              }
            }}
          />
          <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-1">
            <span>{formatPriceValue(globalMin)}</span>
            <span>{formatPriceValue(globalMax)}</span>
          </div>
        </div>
      )}

      {/* Min & Max Inputs */}
      <div className="grid grid-cols-2 gap-2 items-center">
        <div>
          <label className="text-[11px] text-muted-foreground font-medium mb-1 block">
            {t('search.filters.minPrice')}
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              placeholder={String(globalMin)}
              value={minInput}
              onChange={(e) => setMinInput(e.target.value)}
              className="h-8 pl-6 text-xs"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] text-muted-foreground font-medium mb-1 block">
            {t('search.filters.maxPrice')}
          </label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <Input
              type="number"
              placeholder={String(globalMax)}
              value={maxInput}
              onChange={(e) => setMaxInput(e.target.value)}
              className="h-8 pl-6 text-xs"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          className="flex-1 h-8 text-xs font-semibold"
        >
          {t('search.filters.applyPrice')}
        </Button>
        {hasFilter && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePreset(undefined, undefined)}
            className="h-8 text-xs px-2.5"
          >
            {t('search.filters.reset')}
          </Button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="space-y-1.5 pt-1 border-t border-border/50">
        <span className="text-[11px] font-medium text-muted-foreground block mb-1">
          {t('search.filters.quickRanges')}
        </span>
        <div className="grid grid-cols-2 gap-1.5">
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
                className={`justify-start text-left truncate px-2 rounded-md text-[11px] h-7 font-normal ${
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
