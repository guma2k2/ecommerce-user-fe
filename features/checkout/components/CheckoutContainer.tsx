'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, CreditCard, ArrowLeft, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Alert, AlertDescription, buttonVariants, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/shared/stores/authStore';
import { ROUTES } from '@/shared/constants';
import { ShippingAddressForm } from './ShippingAddressForm';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { CheckoutSummaryCard } from './CheckoutSummaryCard';
import { useCreateOrder } from '../hooks';
import { checkoutFormSchema, type CheckoutFormInput } from '../validator';
import type { CheckoutCartItem } from '../types';

interface CheckoutContainerProps {
  items: CheckoutCartItem[];
  totalPrice: number;
  isLoading?: boolean;
}

export function CheckoutContainer({
  items,
  totalPrice,
  isLoading = false,
}: CheckoutContainerProps) {
  const user = useAuthStore((state) => state.user);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      paymentMethod: 'COD',
      note: '',
      shippingAddress: {
        receiverName: user?.name || '',
        receiverPhone: '',
        shippingAddress: '',
        city: '',
        district: '',
        postalCode: '',
      },
    },
  });

  const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder();

  const handleOrderSubmit = (data: CheckoutFormInput) => {
    setErrorMessage(null);

    createOrder(
      {
        fromCart: true,
        paymentMethod: data.paymentMethod,
        note: data.note || undefined,
        shippingAddress: data.shippingAddress,
      },
      {
        onError: (err: unknown) => {
          const apiError = err as { response?: { data?: { message?: string } }; message?: string };
          const msg =
            apiError?.response?.data?.message ||
            apiError?.message ||
            'Failed to place order. Please review your information and try again.';
          setErrorMessage(msg);
        },
      }
    );
  };

  const shippingFee = 0; // Standard free freight or calculated
  const finalTotal = totalPrice + shippingFee;

  if (items.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 space-y-4">
        <Typography.H2 className="text-xl font-bold">Your cart is empty</Typography.H2>
        <Typography.Muted className="text-sm max-w-md block">
          You don&apos;t have any items in your cart to checkout. Browse our catalog to find products you love!
        </Typography.Muted>
        <Link
          href={ROUTES.SHOP.CATALOG}
          className={cn(buttonVariants(), 'mt-2')}
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Navigation header */}
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.SHOP.CART}
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
        >
          <ArrowLeft className="size-4" />
          <span>Back to Cart</span>
        </Link>
        <Typography.H1 className="text-2xl font-bold">Checkout</Typography.H1>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="animate-in fade-in duration-200">
          <AlertCircle className="size-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={form.handleSubmit(handleOrderSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Form: Shipping and Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Shipping Address Section */}
            <Card className="border-border/80">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <MapPin className="size-4 text-primary" />
                  <span>Shipping Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ShippingAddressForm form={form} />
              </CardContent>
            </Card>

            {/* Payment Method Section */}
            <Card className="border-border/80">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="size-4 text-primary" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelector form={form} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary & Review */}
          <div className="lg:col-span-5">
            <CheckoutSummaryCard
              items={items}
              subtotal={totalPrice}
              shippingFee={shippingFee}
              total={finalTotal}
              form={form}
              isSubmitting={isSubmitting}
              onSubmit={form.handleSubmit(handleOrderSubmit)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
