import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchContainer } from '@/features/search';

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} - Shop Genuine Products | Storefront`,
    description: `Explore authentic ${formattedTitle} with top discounts, brand warranties, and detailed specifications.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const formattedTitle = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
      <SearchContainer
        fixedCategorySlug={slug}
        categoryTitle={formattedTitle}
        categoryDescription={`Browse our collection of genuine ${formattedTitle} with live faceted filters for brands, attributes, and price.`}
      />
    </Suspense>
  );
}
