'use client';

import { useMemo, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductDetail, ProductVariant, OptionValueStatus } from '../types';
import {
  findExactVariant,
  findBestMatchingVariant,
  getOptionValueStatus,
} from '../utils';

export function useVariantSelection(product?: ProductDetail | null) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant');

  // Helper to map variant's productOptionValueIds to optionId -> valueId
  const getOptionsForVariant = useCallback(
    (variant: ProductVariant | null | undefined, prod: ProductDetail | null | undefined) => {
      const map: Record<number, number> = {};
      if (variant && prod?.options) {
        variant.productOptionValueIds.forEach((valId) => {
          for (const opt of prod.options) {
            if (opt.values.some((v) => v.id === valId)) {
              map[opt.productOptionId] = valId;
              break;
            }
          }
        });
      }
      return map;
    },
    []
  );

  // Find initial variant from URL param or default to first variant
  const initialVariant = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return null;

    if (variantParam) {
      const match = product.variants.find((v) => String(v.id) === variantParam);
      if (match) return match;
    }

    return product.variants[0];
  }, [product, variantParam]);

  // Map optionId -> optionValueId
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(() => {
    return getOptionsForVariant(initialVariant, product);
  });

  // Track previous product ID and variant param to synchronize during render without useEffect cascading renders
  const [prevProductId, setPrevProductId] = useState<number | null>(product?.id ?? null);
  const [prevVariantParam, setPrevVariantParam] = useState<string | null>(variantParam);

  // If product changed or was just loaded asynchronously, synchronize selectedOptions
  const shouldReinitializeProduct =
    Boolean(product && product.id !== prevProductId) ||
    Boolean(
      product &&
        product.variants &&
        product.variants.length > 0 &&
        Object.keys(selectedOptions).length === 0
    );

  if (shouldReinitializeProduct && product) {
    setPrevProductId(product.id);
    const targetVariant = variantParam
      ? product.variants.find((v) => String(v.id) === variantParam) || product.variants[0]
      : product.variants[0];
    const newMap = getOptionsForVariant(targetVariant, product);
    setSelectedOptions(newMap);
  }

  // If variantParam changed externally (e.g. browser history navigation)
  if (variantParam !== prevVariantParam) {
    setPrevVariantParam(variantParam);
    if (variantParam && product?.variants && product?.options) {
      const matched = product.variants.find((v) => String(v.id) === variantParam);
      if (matched) {
        setSelectedOptions(getOptionsForVariant(matched, product));
      }
    }
  }

  // Find current matching variant from selectedOptions
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    return findExactVariant(product, selectedOptions);
  }, [product, selectedOptions]);

  // Handle changing an option with smart auto-switch for non-existent combinations
  const selectOptionValue = useCallback(
    (productOptionId: number, valueId: number) => {
      if (!product?.variants || product.variants.length === 0) return;

      const matchedVariant = findBestMatchingVariant(
        product,
        productOptionId,
        valueId,
        selectedOptions
      );

      if (matchedVariant) {
        setSelectedOptions(getOptionsForVariant(matchedVariant, product));

        const nextUrl = `/products/${product.slug}?variant=${matchedVariant.id}`;
        router.replace(nextUrl, { scroll: false });
      } else {
        // Fallback for options with zero variants
        const nextOptions = { ...selectedOptions, [productOptionId]: valueId };
        setSelectedOptions(nextOptions);
      }
    },
    [selectedOptions, product, router, getOptionsForVariant]
  );

  // Computes granular option status: 'selected' | 'available' | 'out_of_stock' | 'disabled'
  const getOptionStatus = useCallback(
    (productOptionId: number, valueId: number): OptionValueStatus => {
      return getOptionValueStatus(product, selectedOptions, productOptionId, valueId);
    },
    [product, selectedOptions]
  );

  // Boolean helper for backward compatibility
  const isOptionValueAvailable = useCallback(
    (productOptionId: number, valueId: number): boolean => {
      const status = getOptionValueStatus(product, selectedOptions, productOptionId, valueId);
      return status !== 'disabled';
    },
    [product, selectedOptions]
  );

  return {
    selectedOptions,
    selectedVariant,
    selectOptionValue,
    isOptionValueAvailable,
    getOptionStatus,
  };
}
