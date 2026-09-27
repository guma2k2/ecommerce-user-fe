import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type { ProductDetail } from '../types';

export const productService = {
  /**
   * Fetches full product details by slug (PDP endpoint)
   * Endpoint: GET /api/v1/products/public/{slug}
   */
  getProductBySlug: async (slug: string): Promise<ProductDetail> => {
    const response = await httpRequest.get<ApiResponse<ProductDetail>>(
      `/products/public/${encodeURIComponent(slug)}`
    );
    return response.data.data;
  },
};
