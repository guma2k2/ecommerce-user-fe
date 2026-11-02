import { z } from 'zod';
import type { TFunction } from 'i18next';

export const getShippingAddressSchema = (t?: TFunction<'checkout'>) =>
  z.object({
    receiverName: z
      .string()
      .trim()
      .min(2, t ? t('validation.receiverNameMin') : 'Receiver name must be at least 2 characters')
      .max(100, t ? t('validation.receiverNameMax') : 'Receiver name cannot exceed 100 characters'),
    receiverPhone: z
      .string()
      .trim()
      .min(8, t ? t('validation.phoneMin') : 'Phone number must be at least 8 digits')
      .max(15, t ? t('validation.phoneMax') : 'Phone number cannot exceed 15 digits')
      .regex(/^[0-9+\s()-]+$/, t ? t('validation.phoneInvalid') : 'Invalid phone number format'),
    shippingAddress: z
      .string()
      .trim()
      .min(5, t ? t('validation.addressMin') : 'Address must be at least 5 characters')
      .max(255, t ? t('validation.addressMax') : 'Address cannot exceed 255 characters'),
    city: z
      .string()
      .trim()
      .min(2, t ? t('validation.cityRequired') : 'City is required')
      .max(100, t ? t('validation.cityMax') : 'City cannot exceed 100 characters'),
    district: z
      .string()
      .trim()
      .min(2, t ? t('validation.districtRequired') : 'District is required')
      .max(100, t ? t('validation.districtMax') : 'District cannot exceed 100 characters'),
    postalCode: z
      .string()
      .trim()
      .min(2, t ? t('validation.postalCodeRequired') : 'Postal code is required')
      .max(20, t ? t('validation.postalCodeMax') : 'Postal code cannot exceed 20 characters'),
  });

export const getCheckoutFormSchema = (t?: TFunction<'checkout'>) =>
  z.object({
    shippingAddress: getShippingAddressSchema(t),
    paymentMethod: z.enum(['COD', 'STRIPE'] as const),
    note: z.string().trim().max(500, t ? t('validation.noteMax') : 'Note cannot exceed 500 characters').optional(),
  });

export const shippingAddressSchema = getShippingAddressSchema();
export const checkoutFormSchema = getCheckoutFormSchema();

export type ShippingAddressFormInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
