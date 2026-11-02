'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '../types';

interface OrderTrackingStepperProps {
  status: OrderStatus;
}

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  CONFIRMED: 1,
  PROCESSING: 2,
  SHIPPING: 3,
  DELIVERED: 4,
  CANCELLED: -1,
};

export function OrderTrackingStepper({ status }: OrderTrackingStepperProps) {
  const { t } = useTranslation('orders');

  const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
    { status: 'PENDING', label: t('stepper.placed'), icon: Clock },
    { status: 'CONFIRMED', label: t('stepper.confirmed'), icon: Check },
    { status: 'PROCESSING', label: t('stepper.processing'), icon: Package },
    { status: 'SHIPPING', label: t('stepper.shipping'), icon: Truck },
    { status: 'DELIVERED', label: t('stepper.delivered'), icon: CheckCircle2 },
  ];

  if (status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-destructive">
        <XCircle className="size-6 shrink-0" />
        <div>
          <Typography.Label as="p" className="text-destructive font-semibold">
            {t('stepper.cancelledTitle')}
          </Typography.Label>
          <Typography.Caption as="p" className="mt-0.5 block">
            {t('stepper.cancelledDesc')}
          </Typography.Caption>
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
            width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 48px * ${currentStepIndex / (steps.length - 1)})`,
          }}
        />

        {steps.map((step, index) => {
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
              <Typography.Caption
                className={cn(
                  'text-center max-w-[80px] font-medium transition-colors block',
                  isCurrent
                    ? 'text-primary font-semibold'
                    : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                )}
              >
                {step.label}
              </Typography.Caption>
            </div>
          );
        })}
      </div>
    </div>
  );
}
