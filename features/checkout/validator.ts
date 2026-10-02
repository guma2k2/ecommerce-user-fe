import { z } from 'zod';

export const shippingAddressSchema = z.object({
  receiverName: z
    .string()
    .trim()
    .min(2, 'Receiver name must be at least 2 characters')
    .max(100, 'Receiver name cannot exceed 100 characters'),
  receiverPhone: z
    .string()
    .trim()
    .min(8, 'Phone number must be at least 8 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^[0-9+\s()-]+$/, 'Invalid phone number format'),
  shippingAddress: z
    .string()
    .trim()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address cannot exceed 255 characters'),
  city: z
    .string()
    .trim()
    .min(2, 'City is required')
    .max(100, 'City cannot exceed 100 characters'),
  district: z
    .string()
    .trim()
    .min(2, 'District is required')
    .max(100, 'District cannot exceed 100 characters'),
  postalCode: z
    .string()
    .trim()
    .min(2, 'Postal code is required')
    .max(20, 'Postal code cannot exceed 20 characters'),
});

export const checkoutFormSchema = z.object({
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum(['COD', 'STRIPE'] as const),
  note: z.string().trim().max(500, 'Note cannot exceed 500 characters').optional(),
});

export type ShippingAddressFormInput = z.infer<typeof shippingAddressSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
