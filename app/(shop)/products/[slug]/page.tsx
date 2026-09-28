import type { Metadata } from 'next';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/utils';
import {
  productDetailQueryOptions,
  ProductDetailContainer,
  ProductDetailSkeleton,
} from '@/features/products';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    // New TanStack Query syntax: queryClient.query(options)
    const product = await queryClient.query(productDetailQueryOptions(slug));

    const ogImage = product.medias?.[0]?.url;
    const title = product.metaTitle || `${product.name} | Storefront`;
    const description =
      product.metaDescription ||
      product.description ||
      `Shop genuine ${product.name} with official warranty, full specifications, and fast delivery.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage ? [{ url: ogImage, alt: product.name }] : undefined,
      },
    };
  } catch {
    const formattedTitle = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      title: `${formattedTitle} | Storefront`,
      description: `Shop genuine ${formattedTitle} with official warranty, full specifications, and fast delivery.`,
    };
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  // Prefetch data on the server with new queryClient.query() and swallow error if any
  await queryClient.query(productDetailQueryOptions(slug)).catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContainer slug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
}
