import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type {
  ProductSearchParams,
  ProductSearchResult,
  ProductSuggestionItem,
  SearchFacets,
} from '../types/searchTypes';

export const searchService = {
  /**
   * Fetch autocomplete product suggestions by keyword
   */
  getSuggestions: async (keyword: string, limit = 5): Promise<ProductSuggestionItem[]> => {
    const trimmed = keyword.trim();
    if (!trimmed) return [];

    const response = await httpRequest.get<ApiResponse<ProductSuggestionItem[]>>(
      '/public/products/suggestions',
      {
        params: {
          keyword: trimmed,
          limit,
        },
      }
    );
    return response.data.data || [];
  },

  /**
   * Search and filter products across categories, brands, attributes, and price range
   */
  searchProducts: async (params: ProductSearchParams): Promise<ProductSearchResult> => {
    const response = await httpRequest.get<ApiResponse<ProductSearchResult>>(
      '/public/products/search',
      {
        params,
        paramsSerializer: (serializedParams) => {
          const searchParams = new URLSearchParams();

          for (const [key, value] of Object.entries(serializedParams)) {
            if (value === undefined || value === null || value === '') continue;

            if (Array.isArray(value)) {
              for (const item of value) {
                if (item !== undefined && item !== null && item !== '') {
                  searchParams.append(key, String(item));
                }
              }
            } else {
              searchParams.append(key, String(value));
            }
          }

          return searchParams.toString();
        },
      }
    );

    return response.data.data;
  },

  /**
   * Standalone category facets fetching
   */
  getCategoryFacets: async (categoryId: number): Promise<SearchFacets> => {
    const response = await httpRequest.get<ApiResponse<SearchFacets>>(
      `/public/products/category/${categoryId}/facets`
    );
    return response.data.data;
  },
};
