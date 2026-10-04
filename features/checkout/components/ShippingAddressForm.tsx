'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormInput } from '@/shared/components';
import type { CheckoutFormInput } from '../validator';

interface ShippingAddressFormProps {
  form: UseFormReturn<CheckoutFormInput>;
}

export function ShippingAddressForm({ form }: ShippingAddressFormProps) {
  const { control } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="shippingAddress.receiverName"
          label="Recipient Full Name *"
          placeholder="e.g. Alex Mercer"
        />

        <FormInput
          control={control}
          name="shippingAddress.receiverPhone"
          label="Phone Number *"
          type="tel"
          placeholder="e.g. 0987654321"
        />
      </div>

      <FormInput
        control={control}
        name="shippingAddress.shippingAddress"
        label="Street Address *"
        placeholder="e.g. 72 Le Thanh Ton Street, Ben Nghe Ward"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="shippingAddress.city"
          label="City / Province *"
          placeholder="e.g. Ho Chi Minh City"
        />

        <FormInput
          control={control}
          name="shippingAddress.district"
          label="District *"
          placeholder="e.g. District 1"
        />

        <FormInput
          control={control}
          name="shippingAddress.postalCode"
          label="Postal Code *"
          placeholder="e.g. 70000"
        />
      </div>
    </div>
  );
}
