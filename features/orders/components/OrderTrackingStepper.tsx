'use client';

import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '../types';

interface OrderTrackingStepperProps {
  status: OrderStatus;
}

const STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'PENDING', label: 'Order Placed', icon: Clock },
  { status: 'CONFIRMED', label: 'Confirmed', icon: Check },
  { status: 'PROCESSING', label: 'Processing', icon: Package },
  { status: 'SHIPPING', label: 'Out for Delivery', icon: Truck },
  { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export function OrderTrackingStepper({ status }: OrderTrackingStepperProps) {
  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <XCircle className="size-6 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Order Cancelled</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            This order was cancelled and inventory reservations were restored.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIndex = STATUS_ORDER[status] ?? 0;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        {/* Background track line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-border -z-0" />
        {/* Active track line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-500 -z-0"
          style={{
            width: `calc(${(currentStepIndex / (STEPS.length - 1)) * 100}% - 48px * ${currentStepIndex / (STEPS.length - 1)})`,
          }}
        />

        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div
              key={step.status}
              className="flex flex-col items-center gap-2 relative z-10 select-none"
            >
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                    : isCurrent
                      ? 'border-primary bg-background text-primary ring-4 ring-primary/10 shadow-sm'
                      : 'border-border bg-background text-muted-foreground'
                )}
              >
                <Icon className="size-4.5 stroke-[2.5]" />
              </div>
              <span
                className={cn(
                  'text-xs text-center max-w-[80px] font-medium transition-colors',
                  isCurrent
                    ? 'text-primary font-semibold'
                    : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
