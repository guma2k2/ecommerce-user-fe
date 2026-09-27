'use client';

import React from 'react';
import type { ProductOption } from '../types';

interface ProductOptionPickerProps {
  options: ProductOption[];
  selectedOptions: Record<number, number>;
  onSelectOption: (productOptionId: number, valueId: number) => void;
  isAvailable: (productOptionId: number, valueId: number) => boolean;
}

export function ProductOptionPicker({
  options,
  selectedOptions,
  onSelectOption,
  isAvailable,
}: ProductOptionPickerProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-5">
      {options.map((option) => {
        const selectedValueId = selectedOptions[option.productOptionId];
        const selectedValueName = option.values.find((v) => v.id === selectedValueId)?.value;

        return (
          <div key={option.productOptionId} className="space-y-2.5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{option.name}:</span>
              {selectedValueName && (
                <span className="text-xs font-medium text-muted-foreground">
                  {selectedValueName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {option.values.map((val) => {
                const isSelected = selectedValueId === val.id;
                const available = isAvailable(option.productOptionId, val.id);

                return (
                  <button
                    key={val.id}
                    type="button"
                    disabled={!available}
                    onClick={() => onSelectOption(option.productOptionId, val.id)}
                    className={`relative rounded-xl border px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none ${
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                        : available
                        ? 'border-border/80 bg-card hover:bg-muted/70 hover:border-primary/40 text-foreground'
                        : 'border-border/40 bg-muted/20 text-muted-foreground/40 cursor-not-allowed line-through'
                    }`}
                  >
                    {val.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
