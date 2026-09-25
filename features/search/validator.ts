import { z } from 'zod';

export const searchSortSchema = z.enum(['RELEVANCE', 'PRICE_ASC', 'PRICE_DESC', 'NEWEST']);

export const productSearchQuerySchema = z.object({
  keyword: z.string().max(100).optional(),
  categoryId: z.number().int().positive().optional(),
  categorySlug: z.string().max(100).optional(),
  brandIds: z.array(z.number().int().positive()).optional(),
  attributes: z.array(z.string()).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: searchSortSchema.optional(),
  pageNumber: z.number().int().min(0).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

export type ProductSearchQueryValidation = z.infer<typeof productSearchQuerySchema>;
