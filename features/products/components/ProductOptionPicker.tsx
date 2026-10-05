'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { ProductOption, OptionValueStatus } from '../types';

interface ProductOptionPickerProps {
  options: ProductOption[];
  selectedOptions: Record<number, number>;
  onSelectOption: (productOptionId: number, valueId: number) => void;
  getOptionStatus?: (productOptionId: number, valueId: number) => OptionValueStatus;
  isAvailable?: (productOptionId: number, valueId: number) => boolean;
}

export function ProductOptionPicker({
  options,
  selectedOptions,
  onSelectOption,
  getOptionStatus,
  isAvailable,
}: ProductOptionPickerProps) {
  const { t } = useTranslation('products');

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
                const status: OptionValueStatus = getOptionStatus
                  ? getOptionStatus(option.productOptionId, val.id)
                  : isSelected
                  ? 'selected'
                  : (isAvailable?.(option.productOptionId, val.id) ?? true)
                  ? 'available'
                  : 'disabled';

                const isDisabled = status === 'disabled';

                let styleClasses = '';
                let statusTitle = '';

                switch (status) {
                  case 'selected':
                    styleClasses =
                      'border-primary bg-primary text-primary-foreground shadow-xs ring-2 ring-primary/20 font-bold';
                    break;
                  case 'available':
                    styleClasses =
                      'border-border/80 bg-card hover:bg-muted/70 hover:border-primary/50 text-foreground shadow-2xs';
                    break;
                  case 'out_of_stock':
                    styleClasses =
                      'border-amber-500/40 bg-amber-500/5 hover:border-amber-500/70 text-muted-foreground line-through decoration-amber-500/60';
                    statusTitle = t('optionPicker.outOfStock');
                    break;
                  case 'disabled':
                  default:
                    styleClasses =
                      'border-border/30 bg-muted/15 text-muted-foreground/30 cursor-not-allowed line-through opacity-40 select-none';
                    statusTitle = t('optionPicker.notAvailable');
                    break;
                }

                return (
                  <Button
                    key={val.id}
                    type="button"
                    variant={status === 'selected' ? 'default' : 'outline'}
                    size="sm"
                    disabled={isDisabled}
                    title={statusTitle || undefined}
                    onClick={() => onSelectOption(option.productOptionId, val.id)}
                    className={cn(
                      'relative rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 h-auto',
                      styleClasses
                    )}
                  >
                    {val.value}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
