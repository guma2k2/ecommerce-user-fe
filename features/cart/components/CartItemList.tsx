'use client';

import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { CartItemRow } from './CartItemRow';
import { ClearCartModal } from './ClearCartModal';
import { useClearCart } from '../hooks';
import type { CartItem } from '../types';

interface CartItemListProps {
  items: CartItem[];
  totalQuantity: number;
}

export function CartItemList({ items, totalQuantity }: CartItemListProps) {
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const clearCartMutation = useClearCart();

  const handleConfirmClear = () => {
    clearCartMutation.mutate(undefined, {
      onSettled: () => {
        setIsClearModalOpen(false);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          Cart Items ({totalQuantity})
        </h2>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsClearModalOpen(true)}
          className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg gap-1.5 h-8 px-2.5"
        >
          <Trash2 className="size-3.5" />
          Clear Cart
        </Button>
      </div>

      {/* Item rows */}
      <div className="space-y-3">
        {items.map((item) => (
          <CartItemRow key={item.cartId} item={item} />
        ))}
      </div>

      {/* Clear Confirmation Dialog */}
      <ClearCartModal
        isOpen={isClearModalOpen}
        isLoading={clearCartMutation.isPending}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  );
}
