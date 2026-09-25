'use client';

import { useMemo, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type {
  ActiveFilterItem,
  ProductSearchParams,
  SearchSortOption,
} from '../types';
import {
  parseAttributesList,
  serializeAttributesMap,
  formatPriceRange,
} from '../utils';

interface UseSearchFiltersOptions {
  fixedCategoryId?: number;
  fixedCategorySlug?: string;
  defaultPageSize?: number;
}

export function useSearchFilters(options: UseSearchFiltersOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { fixedCategoryId, fixedCategorySlug, defaultPageSize = 12 } = options;

  // 1. Parse current URL state into structured search params
  const currentFilters = useMemo<ProductSearchParams>(() => {
    const keyword = searchParams.get('keyword') || undefined;

    // Category ID (prioritize fixed prop, then query param)
    const categoryIdParam = searchParams.get('category_id');
    const categoryId =
      fixedCategoryId ??
      (categoryIdParam ? parseInt(categoryIdParam, 10) : undefined);

    // Category Slug (prioritize fixed prop, then query param)
    const categorySlug =
      fixedCategorySlug ?? searchParams.get('category_slug') ?? undefined;

    // Brands (can be multiple brand_ids params or comma-separated)
    const brandParams = searchParams.getAll('brand_ids');
    let brandIds: number[] = [];
    if (brandParams.length > 0) {
      brandIds = brandParams
        .flatMap((bp) => bp.split(','))
        .map((id) => parseInt(id.trim(), 10))
        .filter((id) => !isNaN(id) && id > 0);
    }

    // Attributes (format: "1:Black,Blue")
    const attributeParams = searchParams.getAll('attributes');

    // Price range
    const minPriceParam = searchParams.get('min_price');
    const maxPriceParam = searchParams.get('max_price');
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    // Sort
    const sortParam = searchParams.get('sort') as SearchSortOption | null;
    const sort: SearchSortOption =
      sortParam && ['RELEVANCE', 'PRICE_ASC', 'PRICE_DESC', 'NEWEST'].includes(sortParam)
        ? sortParam
        : 'RELEVANCE';

    // Page (URL uses 1-based, backend API uses 0-based page_number)
    const pageParam = searchParams.get('page');
    const pageIndex = pageParam ? Math.max(0, parseInt(pageParam, 10) - 1) : 0;

    const pageSizeParam = searchParams.get('page_size');
    const pageSize = pageSizeParam ? parseInt(pageSizeParam, 10) : defaultPageSize;

    return {
      keyword,
      categoryId,
      categorySlug,
      brandIds: brandIds.length > 0 ? brandIds : undefined,
      attributes: attributeParams.length > 0 ? attributeParams : undefined,
      minPrice,
      maxPrice,
      sort,
      pageNumber: pageIndex,
      pageSize,
    };
  }, [searchParams, fixedCategoryId, fixedCategorySlug, defaultPageSize]);

  // 2. Helper to push new URL params while resetting page to 1
  const updateUrl = useCallback(
    (newParams: URLSearchParams, resetPage = true) => {
      if (resetPage) {
        newParams.delete('page');
      }
      const qs = newParams.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [pathname, router]
  );

  // 3. Filter Mutators
  const setKeyword = useCallback(
    (keyword: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = keyword.trim();
      if (trimmed) {
        params.set('keyword', trimmed);
      } else {
        params.delete('keyword');
      }
      updateUrl(params, true);
    },
    [searchParams, updateUrl]
  );

  const toggleBrand = useCallback(
    (brandId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      const existingBrands = currentFilters.brandIds || [];
      const hasBrand = existingBrands.includes(brandId);

      const nextBrands = hasBrand
        ? existingBrands.filter((id) => id !== brandId)
        : [...existingBrands, brandId];

      params.delete('brand_ids');
      nextBrands.forEach((id) => params.append('brand_ids', String(id)));

      updateUrl(params, true);
    },
    [searchParams, currentFilters.brandIds, updateUrl]
  );

  const toggleAttribute = useCallback(
    (attributeId: number, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const attrMap = parseAttributesList(currentFilters.attributes);
      const currentValues = attrMap.get(attributeId) || [];

      let nextValues: string[];
      if (currentValues.includes(value)) {
        nextValues = currentValues.filter((v) => v !== value);
      } else {
        nextValues = [...currentValues, value];
      }

      if (nextValues.length > 0) {
        attrMap.set(attributeId, nextValues);
      } else {
        attrMap.delete(attributeId);
      }

      const serializedAttrs = serializeAttributesMap(attrMap);
      params.delete('attributes');
      serializedAttrs.forEach((attrStr) => params.append('attributes', attrStr));

      updateUrl(params, true);
    },
    [searchParams, currentFilters.attributes, updateUrl]
  );

  const setPriceRange = useCallback(
    (minPrice?: number, maxPrice?: number) => {
      const params = new URLSearchParams(searchParams.toString());

      if (minPrice !== undefined && minPrice !== null && !isNaN(minPrice)) {
        params.set('min_price', String(minPrice));
      } else {
        params.delete('min_price');
      }

      if (maxPrice !== undefined && maxPrice !== null && !isNaN(maxPrice)) {
        params.set('max_price', String(maxPrice));
      } else {
        params.delete('max_price');
      }

      updateUrl(params, true);
    },
    [searchParams, updateUrl]
  );

  const setSort = useCallback(
    (sort: SearchSortOption) => {
      const params = new URLSearchParams(searchParams.toString());
      if (sort === 'RELEVANCE') {
        params.delete('sort');
      } else {
        params.set('sort', sort);
      }
      updateUrl(params, true);
    },
    [searchParams, updateUrl]
  );

  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete('page');
      } else {
        params.set('page', String(page));
      }
      // Scroll to top of catalog when paginating
      const qs = params.toString();
      const targetUrl = qs ? `${pathname}?${qs}` : pathname;
      router.push(targetUrl, { scroll: true });
    },
    [pathname, router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams();
    // Preserve keyword if user is actively searching
    const kw = searchParams.get('keyword');
    if (kw) {
      params.set('keyword', kw);
    }
    const qs = params.toString();
    const targetUrl = qs ? `${pathname}?${qs}` : pathname;
    router.push(targetUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  // 4. Generate active filter badges list for chips display
  const activeFilters = useMemo<ActiveFilterItem[]>(() => {
    const items: ActiveFilterItem[] = [];

    // Brands
    if (currentFilters.brandIds && currentFilters.brandIds.length > 0) {
      currentFilters.brandIds.forEach((brandId) => {
        items.push({
          type: 'brand',
          key: `brand-${brandId}`,
          label: `Brand ID: ${brandId}`,
          value: brandId,
        });
      });
    }

    // Attributes
    if (currentFilters.attributes && currentFilters.attributes.length > 0) {
      const attrMap = parseAttributesList(currentFilters.attributes);
      for (const [attrId, values] of attrMap.entries()) {
        values.forEach((val) => {
          items.push({
            type: 'attribute',
            key: `attr-${attrId}-${val}`,
            label: val,
            value: val,
            attributeId: attrId,
          });
        });
      }
    }

    // Price
    if (currentFilters.minPrice !== undefined || currentFilters.maxPrice !== undefined) {
      items.push({
        type: 'price',
        key: 'price-filter',
        label: formatPriceRange(currentFilters.minPrice, currentFilters.maxPrice),
        value: `${currentFilters.minPrice ?? ''}-${currentFilters.maxPrice ?? ''}`,
      });
    }

    return items;
  }, [currentFilters]);

  const removeFilter = useCallback(
    (filter: ActiveFilterItem) => {
      if (filter.type === 'brand') {
        toggleBrand(filter.value as number);
      } else if (filter.type === 'attribute' && filter.attributeId !== undefined) {
        toggleAttribute(filter.attributeId, filter.value as string);
      } else if (filter.type === 'price') {
        setPriceRange(undefined, undefined);
      }
    },
    [toggleBrand, toggleAttribute, setPriceRange]
  );

  return {
    params: currentFilters,
    currentPage: (currentFilters.pageNumber ?? 0) + 1,
    activeFilters,
    hasActiveFilters: activeFilters.length > 0,
    setKeyword,
    toggleBrand,
    toggleAttribute,
    setPriceRange,
    setSort,
    setPage,
    removeFilter,
    clearAllFilters,
  };
}
