'use client';

import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Button,
  Alert,
  AlertDescription,
} from '@/components/ui';
import { useCancelOrder } from '../hooks';

interface CancelOrderDialogProps {
  orderId: string;
  orderCode: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CancelOrderDialog({
  orderId,
  orderCode,
  open,
  onOpenChange,
  onSuccess,
}: CancelOrderDialogProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const handleConfirmCancel = () => {
    setErrorMessage(null);
    cancelOrder(orderId, {
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
      },
      onError: (err: unknown) => {
        const apiError = err as { response?: { data?: { message?: string } }; message?: string };
        setErrorMessage(
          apiError?.response?.data?.message ||
            apiError?.message ||
            'Unable to cancel this order. Only pending orders can be cancelled.'
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-2">
            <AlertTriangle className="size-6" />
          </div>
          <DialogTitle className="text-center">Cancel Order?</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Are you sure you want to cancel order{' '}
            <strong className="text-foreground font-mono">{orderCode}</strong>? This action will
            restore the reserved stock and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <Alert variant="destructive" className="py-2 text-xs">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <DialogFooter className="flex gap-2 sm:gap-0 mt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Keep Order
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleConfirmCancel}
            className="gap-2"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            <span>Yes, Cancel Order</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
