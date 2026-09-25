'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Sparkles } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { useSearchFilters, useProductSearch } from '../hooks';
import { SearchBar } from './SearchBar';
import { SearchFacetSidebar } from './SearchFacetSidebar';
import { SearchFacetDrawer } from './SearchFacetDrawer';
import { ActiveFilterChips } from './ActiveFilterChips';
import { SearchSortSelect } from './SearchSortSelect';
import { SearchProductGrid } from './SearchProductGrid';
import { SearchPagination } from './SearchPagination';

interface SearchContainerProps {
  fixedCategoryId?: number;
  fixedCategorySlug?: string;
  categoryTitle?: string;
  categoryDescription?: string;
}

export function SearchContainer({
  fixedCategoryId,
  fixedCategorySlug,
  categoryTitle,
  categoryDescription,
}: SearchContainerProps) {
  const {
    params,
    currentPage,
    activeFilters,
    hasActiveFilters,
    toggleBrand,
    toggleAttribute,
    setPriceRange,
    setSort,
    setPage,
    removeFilter,
    clearAllFilters,
    setKeyword,
  } = useSearchFilters({
    fixedCategoryId,
    fixedCategorySlug,
    defaultPageSize: 12,
  });

  const { products, pagination, facets, isLoading } = useProductSearch(params);

  const isCategoryMode = Boolean(fixedCategorySlug || fixedCategoryId);
  const totalElements = pagination?.totalElements ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 max-w-7xl">
      {/* 1. Breadcrumbs & Page Header */}
      <div className="space-y-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60" />

          {isCategoryMode ? (
            <>
              <Link
                href={ROUTES.SHOP.CATALOG}
                className="hover:text-foreground transition-colors"
              >
                Categories
              </Link>
              <ChevronRight className="size-3 text-muted-foreground/60" />
              <span className="font-semibold text-foreground capitalize">
                {categoryTitle || fixedCategorySlug || 'Category'}
              </span>
            </>
          ) : (
            <span className="font-semibold text-foreground">
              {params.keyword ? 'Search' : 'Catalog'}
            </span>
          )}
        </nav>

        {/* Title & Search bar row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary mb-1">
              <Sparkles className="size-3" />
              <span>{isCategoryMode ? 'Category Store' : 'Discovery Engine'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground capitalize">
              {isCategoryMode
                ? categoryTitle || fixedCategorySlug || 'Products'
                : params.keyword
                ? `Results for "${params.keyword}"`
                : 'All Products'}
            </h1>

            {categoryDescription && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                {categoryDescription}
              </p>
            )}
          </div>

          {/* In-page Search Bar */}
          <div className="w-full md:w-80">
            <SearchBar
              initialValue={params.keyword || ''}
              placeholder="Refine search..."
              onSearch={(kw) => setKeyword(kw)}
            />
          </div>
        </div>
      </div>

      {/* 2. Toolbar & Active Filters */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-3 border-y border-border/60 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Sheet Trigger */}
            <SearchFacetDrawer
              facets={facets}
              selectedBrandIds={params.brandIds}
              selectedAttributes={params.attributes}
              minPrice={params.minPrice}
              maxPrice={params.maxPrice}
              activeFilterCount={activeFilters.length}
              totalElements={totalElements}
              onToggleBrand={toggleBrand}
              onToggleAttribute={toggleAttribute}
              onApplyPriceRange={setPriceRange}
              onClearAll={clearAllFilters}
            />

            {/* Results count text */}
            <p className="text-xs sm:text-sm text-muted-foreground">
              {isLoading ? (
                'Loading products...'
              ) : totalElements > 0 ? (
                <>
                  Showing <strong className="text-foreground">{products.length}</strong> of{' '}
                  <strong className="text-foreground">{totalElements}</strong> items
                </>
              ) : (
                'No products match your criteria'
              )}
            </p>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-medium text-muted-foreground">
              Sort by:
            </span>
            <SearchSortSelect
              value={params.sort || 'RELEVANCE'}
              onChange={setSort}
            />
          </div>
        </div>

        {/* Active Filter Chips */}
        <ActiveFilterChips
          activeFilters={activeFilters}
          facets={facets}
          onRemoveFilter={removeFilter}
          onClearAll={clearAllFilters}
        />
      </div>

      {/* 3. Main Discovery 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
        {/* Desktop Sidebar (1 column) */}
        <div className="hidden md:block md:col-span-1 sticky top-20">
          <SearchFacetSidebar
            facets={facets}
            selectedBrandIds={params.brandIds}
            selectedAttributes={params.attributes}
            minPrice={params.minPrice}
            maxPrice={params.maxPrice}
            hasActiveFilters={hasActiveFilters}
            onToggleBrand={toggleBrand}
            onToggleAttribute={toggleAttribute}
            onApplyPriceRange={setPriceRange}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Product Catalog Grid + Pagination (3 columns) */}
        <main className="md:col-span-3 space-y-6">
          <SearchProductGrid
            products={products}
            isLoading={isLoading}
            hasActiveFilters={hasActiveFilters}
            keyword={params.keyword}
            pageSize={params.pageSize}
            onResetFilters={clearAllFilters}
          />

          <SearchPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </main>
      </div>
    </div>
  );
}
