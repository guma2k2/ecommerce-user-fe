'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseFormReturn } from 'react-hook-form';
import { FormInput } from '@/shared/components';
import type { CheckoutFormInput } from '../validator';

interface ShippingAddressFormProps {
  form: UseFormReturn<CheckoutFormInput>;
}

export function ShippingAddressForm({ form }: ShippingAddressFormProps) {
  const { t } = useTranslation('checkout');
  const { control } = form;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          control={control}
          name="shippingAddress.receiverName"
          label={t('shipping.receiverName')}
          placeholder={t('shipping.receiverNamePlaceholder')}
        />

        <FormInput
          control={control}
          name="shippingAddress.receiverPhone"
          label={t('shipping.receiverPhone')}
          type="tel"
          placeholder={t('shipping.receiverPhonePlaceholder')}
        />
      </div>

      <FormInput
        control={control}
        name="shippingAddress.shippingAddress"
        label={t('shipping.address')}
        placeholder={t('shipping.addressPlaceholder')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormInput
          control={control}
          name="shippingAddress.city"
          label={t('shipping.city')}
          placeholder={t('shipping.cityPlaceholder')}
        />

        <FormInput
          control={control}
          name="shippingAddress.district"
          label={t('shipping.district')}
          placeholder={t('shipping.districtPlaceholder')}
        />

        <FormInput
          control={control}
          name="shippingAddress.postalCode"
          label={t('shipping.postalCode')}
          placeholder={t('shipping.postalCodePlaceholder')}
        />
      </div>
    </div>
  );
}
