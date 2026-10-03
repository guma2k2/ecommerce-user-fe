'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button, Typography } from '@/components/ui';

interface ClearCartModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ClearCartModal({
  isOpen,
  isLoading = false,
  onConfirm,
  onCancel,
}: ClearCartModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-cart-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-xs animate-in fade-in-0 duration-200"
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive shrink-0">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <Typography.H3 id="clear-cart-title" className="text-base font-bold">
              Clear Shopping Cart?
            </Typography.H3>
            <Typography.Caption className="text-xs mt-0.5 block">
              This action cannot be undone. All items will be removed.
            </Typography.Caption>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-xl font-medium"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-xl font-semibold shadow-xs"
          >
            {isLoading ? 'Clearing...' : 'Clear Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
