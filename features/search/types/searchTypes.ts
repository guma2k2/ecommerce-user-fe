export interface ProductSuggestionItem {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  price: number | null;
  categoryName: string | null;
}

export interface ProductSearchItem {
  id: number;
  name: string;
  slug: string;
  thumbnailUrl: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  brandName: string | null;
  categoryName: string | null;
}

export interface FacetAttributeValue {
  value: string;
  count: number;
}

export interface FacetAttribute {
  id: number;
  name: string;
  values: FacetAttributeValue[];
}

export interface FacetBrand {
  id: number;
  name: string;
  count: number;
}

export interface PriceRangeFacet {
  minPrice: number | null;
  maxPrice: number | null;
}

export type FacetPriceRangeData = PriceRangeFacet;

export interface SearchFacets {
  attributes: FacetAttribute[];
  brands: FacetBrand[];
  priceRange: PriceRangeFacet;
}

export interface PaginatedProducts {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  content: ProductSearchItem[];
}

export interface ProductSearchResult {
  products: PaginatedProducts;
  facets: SearchFacets;
}

export type SearchSortOption = 'RELEVANCE' | 'PRICE_ASC' | 'PRICE_DESC' | 'NEWEST';

export interface ProductSearchParams {
  keyword?: string;
  categoryId?: number;
  categorySlug?: string;
  brandIds?: number[];
  attributes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: SearchSortOption;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * Filter state representation used in UI components
 */
export interface ActiveFilterItem {
  type: 'keyword' | 'brand' | 'attribute' | 'price' | 'category';
  key: string;
  label: string;
  value: string | number;
  attributeId?: number;
}
