'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui';
import { getSwatchColor } from '../utils';
import type { FacetAttribute } from '../types';

interface FacetAttributeGroupProps {
  attribute: FacetAttribute;
  selectedValues?: string[];
  onToggleValue: (attributeId: number, value: string) => void;
}

export function FacetAttributeGroup({
  attribute,
  selectedValues = [],
  onToggleValue,
}: FacetAttributeGroupProps) {
  const isColorAttribute =
    attribute.name.toLowerCase().includes('color') ||
    attribute.name.toLowerCase().includes('màu');

  if (!attribute.values || attribute.values.length === 0) return null;

  return (
    <div className="space-y-2">
      {isColorAttribute ? (
        /* Color Swatches Grid */
        <div className="flex flex-wrap gap-2 pt-1">
          {attribute.values.map((item) => {
            const isSelected = selectedValues.includes(item.value);
            const hexColor = getSwatchColor(item.value);

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onToggleValue(attribute.id, item.value)}
                title={`${item.value} (${item.count})`}
                className={`group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all border ${
                  isSelected
                    ? 'border-primary bg-primary/10 text-primary font-semibold shadow-xs ring-2 ring-primary/20'
                    : 'border-border/80 bg-background text-foreground hover:border-foreground/40 hover:bg-muted/40'
                }`}
              >
                {hexColor ? (
                  <span
                    className="size-3.5 rounded-full border border-black/20 shrink-0 flex items-center justify-center shadow-2xs"
                    style={{ backgroundColor: hexColor }}
                  >
                    {isSelected && (
                      <Check
                        className={`size-2.5 stroke-3 ${
                          item.value.toLowerCase() === 'white'
                            ? 'text-black'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </span>
                ) : null}
                <span>{item.value}</span>
                <span className="text-[10px] text-muted-foreground/80 font-mono">
                  ({item.count})
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Standard Checkbox List */
        <div className="max-h-52 overflow-y-auto pr-1 space-y-1 scrollbar-thin">
          {attribute.values.map((item) => {
            const isChecked = selectedValues.includes(item.value);
            return (
              <label
                key={item.value}
                className="flex items-center justify-between gap-2.5 px-2 py-1.5 rounded-lg text-sm hover:bg-muted/60 transition-colors cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={() =>
                      onToggleValue(attribute.id, item.value)
                    }
                  />
                  <span
                    className={`truncate text-xs sm:text-sm transition-colors ${
                      isChecked
                        ? 'font-semibold text-primary'
                        : 'text-foreground/90 group-hover:text-foreground'
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md font-mono">
                  {item.count}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
