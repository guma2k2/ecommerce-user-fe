import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductDetailContainer, ProductDetailSkeleton } from '@/features/products';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const formattedTitle = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    title: `${formattedTitle} | Storefront`,
    description: `Shop genuine ${formattedTitle} with official warranty, full specifications, and fast delivery.`,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailContainer slug={slug} />
    </Suspense>
  );
}
