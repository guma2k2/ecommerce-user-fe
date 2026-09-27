'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ProductDetail, ProductVariant } from '../types';

export function useVariantSelection(product: ProductDetail) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const variantParam = searchParams.get('variant');

  // Find initial variant from URL param or default to first variant
  const initialVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;

    if (variantParam) {
      const match = product.variants.find((v) => String(v.id) === variantParam);
      if (match) return match;
    }

    return product.variants[0];
  }, [product.variants, variantParam]);

  // Map optionId -> optionValueId
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>(() => {
    const initialMap: Record<number, number> = {};
    if (initialVariant && product.options) {
      initialVariant.productOptionValueIds.forEach((valId) => {
        // Find which option contains this valId
        for (const opt of product.options) {
          if (opt.values.some((v) => v.id === valId)) {
            initialMap[opt.productOptionId] = valId;
            break;
          }
        }
      });
    }
    return initialMap;
  });

  // Keep selectedOptions in sync if variantParam changes externally
  useEffect(() => {
    if (variantParam && product.variants && product.options) {
      const matched = product.variants.find((v) => String(v.id) === variantParam);
      if (matched) {
        const newMap: Record<number, number> = {};
        matched.productOptionValueIds.forEach((valId) => {
          for (const opt of product.options) {
            if (opt.values.some((v) => v.id === valId)) {
              newMap[opt.productOptionId] = valId;
              break;
            }
          }
        });
        setSelectedOptions(newMap);
      }
    }
  }, [variantParam, product.variants, product.options]);

  // Find current matching variant from selectedOptions
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product.variants || product.variants.length === 0) return null;

    const selectedValueIds = Object.values(selectedOptions);
    if (selectedValueIds.length === 0) return product.variants[0];

    // Find variant that contains all selected values
    const exactMatch = product.variants.find((v) =>
      selectedValueIds.every((valId) => v.productOptionValueIds.includes(valId))
    );

    return exactMatch || product.variants[0];
  }, [product.variants, selectedOptions]);

  // Handle changing an option
  const selectOptionValue = useCallback(
    (productOptionId: number, valueId: number) => {
      const nextOptions = { ...selectedOptions, [productOptionId]: valueId };
      setSelectedOptions(nextOptions);

      // Find best matching variant for URL sync
      const nextValues = Object.values(nextOptions);
      const match = product.variants.find((v) =>
        nextValues.every((valId) => v.productOptionValueIds.includes(valId))
      );

      if (match) {
        const nextUrl = `/products/${product.slug}?variant=${match.id}`;
        router.replace(nextUrl, { scroll: false });
      }
    },
    [selectedOptions, product.variants, product.slug, router]
  );

  // Check if a specific option value combination is available in any variant
  const isOptionValueAvailable = useCallback(
    (productOptionId: number, valueId: number): boolean => {
      // Check if there is any variant that contains this value
      return product.variants.some((v) => v.productOptionValueIds.includes(valueId));
    },
    [product.variants]
  );

  return {
    selectedOptions,
    selectedVariant,
    selectOptionValue,
    isOptionValueAvailable,
  };
}
