'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input, Label } from '@/components/ui';
import type { CheckoutFormInput } from '../validator';

interface ShippingAddressFormProps {
  form: UseFormReturn<CheckoutFormInput>;
}

export function ShippingAddressForm({ form }: ShippingAddressFormProps) {
  const {
    register,
    formState: { errors },
  } = form;

  const addressErrors = errors.shippingAddress;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Receiver Name */}
        <div className="space-y-1.5">
          <Label htmlFor="receiverName">Recipient Full Name *</Label>
          <Input
            id="receiverName"
            placeholder="e.g. Alex Mercer"
            {...register('shippingAddress.receiverName')}
            aria-invalid={Boolean(addressErrors?.receiverName)}
          />
          {addressErrors?.receiverName && (
            <p className="text-xs text-destructive">{addressErrors.receiverName.message}</p>
          )}
        </div>

        {/* Receiver Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="receiverPhone">Phone Number *</Label>
          <Input
            id="receiverPhone"
            type="tel"
            placeholder="e.g. 0987654321"
            {...register('shippingAddress.receiverPhone')}
            aria-invalid={Boolean(addressErrors?.receiverPhone)}
          />
          {addressErrors?.receiverPhone && (
            <p className="text-xs text-destructive">{addressErrors.receiverPhone.message}</p>
          )}
        </div>
      </div>

      {/* Street Address */}
      <div className="space-y-1.5">
        <Label htmlFor="shippingAddress">Street Address *</Label>
        <Input
          id="shippingAddress"
          placeholder="e.g. 72 Le Thanh Ton Street, Ben Nghe Ward"
          {...register('shippingAddress.shippingAddress')}
          aria-invalid={Boolean(addressErrors?.shippingAddress)}
        />
        {addressErrors?.shippingAddress && (
          <p className="text-xs text-destructive">{addressErrors.shippingAddress.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* City */}
        <div className="space-y-1.5">
          <Label htmlFor="city">City / Province *</Label>
          <Input
            id="city"
            placeholder="e.g. Ho Chi Minh City"
            {...register('shippingAddress.city')}
            aria-invalid={Boolean(addressErrors?.city)}
          />
          {addressErrors?.city && (
            <p className="text-xs text-destructive">{addressErrors.city.message}</p>
          )}
        </div>

        {/* District */}
        <div className="space-y-1.5">
          <Label htmlFor="district">District *</Label>
          <Input
            id="district"
            placeholder="e.g. District 1"
            {...register('shippingAddress.district')}
            aria-invalid={Boolean(addressErrors?.district)}
          />
          {addressErrors?.district && (
            <p className="text-xs text-destructive">{addressErrors.district.message}</p>
          )}
        </div>

        {/* Postal Code */}
        <div className="space-y-1.5">
          <Label htmlFor="postalCode">Postal Code *</Label>
          <Input
            id="postalCode"
            placeholder="e.g. 70000"
            {...register('shippingAddress.postalCode')}
            aria-invalid={Boolean(addressErrors?.postalCode)}
          />
          {addressErrors?.postalCode && (
            <p className="text-xs text-destructive">{addressErrors.postalCode.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
