'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Home, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
} from '@/components/ui';
import { useProductDetail, useVariantSelection } from '../hooks';
import { ProductMediaGallery } from './ProductMediaGallery';
import { ProductPurchasePanel } from './ProductPurchasePanel';
import { ProductInfoTabs } from './ProductInfoTabs';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';

interface ProductDetailContainerProps {
  slug: string;
}

export function ProductDetailContainer({ slug }: ProductDetailContainerProps) {
  const { t } = useTranslation('products');
  const { t: tCommon } = useTranslation('common');
  const { data: product, isLoading, isError } = useProductDetail(slug);

  const {
    selectedOptions,
    selectedVariant,
    selectOptionValue,
    getOptionStatus,
    isOptionValueAvailable,
  } = useVariantSelection(product);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-xl space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{t('notFound.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('notFound.description')}
        </p>
        <Link href={ROUTES.SHOP.SEARCH}>
          <Button className="rounded-xl mt-2 gap-2">
            <ArrowLeft className="size-4" />
            {t('notFound.backToCatalog')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="pb-1">
        <BreadcrumbList className="flex-nowrap overflow-x-auto whitespace-nowrap text-xs sm:text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link
                  href={ROUTES.HOME}
                  className="flex items-center gap-1.5"
                />
              }
            >
              <Home className="size-3.5" />
              <span>{tCommon('nav.home')}</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {product.category?.name && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={
                    <Link
                      href={`${ROUTES.SHOP.SEARCH}?category_id=${product.category.id}`}
                    />
                  }
                >
                  {product.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}

          <BreadcrumbItem className="min-w-0">
            <BreadcrumbPage className="font-semibold text-foreground truncate max-w-xs sm:max-w-md block">
              {product.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Top 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
        {/* Left Column: Media Gallery */}
        <ProductMediaGallery
          medias={product.medias}
          activeVariant={selectedVariant}
          productName={product.name}
        />

        {/* Right Column: Purchase Panel */}
        <ProductPurchasePanel
          product={product}
          activeVariant={selectedVariant}
          selectedOptions={selectedOptions}
          onSelectOption={selectOptionValue}
          getOptionStatus={getOptionStatus}
          isAvailable={isOptionValueAvailable}
        />
      </div>

      {/* Bottom Tabs: Description, Technical Specifications, Policy */}
      <ProductInfoTabs product={product} activeVariant={selectedVariant} />
    </div>
  );
}
