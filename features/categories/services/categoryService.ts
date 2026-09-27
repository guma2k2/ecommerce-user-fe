import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type { CategoryItem } from '../types';

export const categoryService = {
  /**
   * Fetches parent category tree (root categories with direct children)
   * Endpoint: GET /api/v1/categories/public/parents
   */
  getParentCategories: async (): Promise<CategoryItem[]> => {
    const response = await httpRequest.get<ApiResponse<CategoryItem[]>>(
      '/categories/public/parents'
    );
    return response.data.data || [];
  },

  /**
   * Fetches category by name
   * Endpoint: GET /api/v1/categories/public/{name}
   */
  getCategoryByName: async (name: string): Promise<CategoryItem> => {
    const response = await httpRequest.get<ApiResponse<CategoryItem>>(
      `/categories/public/${encodeURIComponent(name)}`
    );
    return response.data.data;
  },
};
