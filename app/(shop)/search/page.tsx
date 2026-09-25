import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchContainer } from '@/features/search';

interface SearchPageProps {
  searchParams: Promise<{
    keyword?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { keyword } = await searchParams;

  if (keyword && keyword.trim()) {
    return {
      title: `Search results for "${keyword}" | Storefront`,
      description: `Discover matching products for "${keyword}" with real-time brand, attribute, and price filtering.`,
    };
  }

  return {
    title: 'Store Catalog & Discovery | Storefront',
    description: 'Explore our catalog of products, compare prices, and filter by attributes.',
  };
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 max-w-7xl animate-pulse">
          <div className="h-8 w-48 bg-muted/60 rounded-xl" />
          <div className="h-12 w-full bg-muted/40 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            <div className="h-96 bg-muted/40 rounded-2xl hidden md:block" />
            <div className="md:col-span-3 h-96 bg-muted/30 rounded-2xl" />
          </div>
        </div>
      }
    >
      <SearchContainer />
    </Suspense>
  );
}
