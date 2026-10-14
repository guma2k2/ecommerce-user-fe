'use client';

import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCreateCheckoutSession } from '../hooks';

interface PayOrderButtonProps {
  orderId: string;
  orderCode: string;
  amount: number;
  currency?: string;
  className?: string;
}

export function PayOrderButton({
  orderId,
  orderCode,
  amount,
  currency = 'USD',
  className,
}: PayOrderButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createSession, isPending } = useCreateCheckoutSession();

  const handlePayNow = () => {
    setErrorMessage(null);

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const returnUrl = `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${encodeURIComponent(orderId)}&order_code=${encodeURIComponent(orderCode)}`;
    const cancelUrl = `${origin}/orders/${encodeURIComponent(orderId)}`;

    createSession(
      {
        payload: {
          orderId,
          amount,
          currency,
          paymentMethod: 'STRIPE',
          returnUrl,
          cancelUrl,
        },
      },
      {
        onSuccess: (data) => {
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          }
        },
        onError: (err) => {
          const apiError = err as { response?: { data?: { message?: string } }; message?: string };
          setErrorMessage(
            apiError?.response?.data?.message ||
              apiError?.message ||
              'Failed to initiate payment session. Please try again.'
          );
        },
      }
    );
  };

  return (
    <div className="space-y-1.5 w-full">
      <Button
        type="button"
        size="sm"
        onClick={handlePayNow}
        disabled={isPending}
        className={className || 'w-full gap-2'}
      >
        {isPending ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            <span>Connecting to Stripe...</span>
          </>
        ) : (
          <>
            <CreditCard className="size-3.5" />
            <span>Pay Now with Card</span>
          </>
        )}
      </Button>
      {errorMessage && (
        <p className="text-[11px] text-destructive leading-tight">{errorMessage}</p>
      )}
    </div>
  );
}
