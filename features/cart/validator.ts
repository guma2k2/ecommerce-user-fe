import { z } from 'zod';

export const addToCartSchema = z.object({
  productVariantId: z.number().int().positive('Product variant is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export const updateCartQuantitySchema = z.object({
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

export type AddToCartSchemaInput = z.infer<typeof addToCartSchema>;
export type UpdateCartQuantitySchemaInput = z.infer<typeof updateCartQuantitySchema>;
