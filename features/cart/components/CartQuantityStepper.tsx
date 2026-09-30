'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui';

interface CartQuantityStepperProps {
  quantity: number;
  maxStock: number;
  disabled?: boolean;
  onQuantityChange: (newQuantity: number) => void;
}

export function CartQuantityStepper({
  quantity,
  maxStock,
  disabled = false,
  onQuantityChange,
}: CartQuantityStepperProps) {
  const isMin = quantity <= 1;
  const isMax = quantity >= maxStock;

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMin && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isMax && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="inline-flex items-center rounded-lg border border-border/70 bg-background/80 p-0.5 shadow-2xs">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isMin || disabled}
        onClick={handleDecrease}
        aria-label="Decrease quantity"
        className="size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40"
      >
        <Minus className="size-3.5" />
      </Button>

      <span
        className="w-9 text-center text-xs font-semibold select-none tabular-nums text-foreground"
        aria-live="polite"
      >
        {quantity}
      </span>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={isMax || disabled}
        onClick={handleIncrease}
        aria-label="Increase quantity"
        className="size-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
