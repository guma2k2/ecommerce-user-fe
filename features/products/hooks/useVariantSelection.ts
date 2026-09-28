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
    const initialMap: Record<number, number> = {};
    if (initialVariant && product?.options) {
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

  // Keep selectedOptions in sync if variantParam changes externally without effect-driven cascading renders
  const [prevVariantParam, setPrevVariantParam] = useState(variantParam);
  if (variantParam !== prevVariantParam) {
    setPrevVariantParam(variantParam);
    if (variantParam && product?.variants && product?.options) {
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
        const newMap: Record<number, number> = {};
        matchedVariant.productOptionValueIds.forEach((valId) => {
          for (const opt of product.options) {
            if (opt.values.some((v) => v.id === valId)) {
              newMap[opt.productOptionId] = valId;
              break;
            }
          }
        });
        setSelectedOptions(newMap);

        const nextUrl = `/products/${product.slug}?variant=${matchedVariant.id}`;
        router.replace(nextUrl, { scroll: false });
      } else {
        // Fallback for options with zero variants
        const nextOptions = { ...selectedOptions, [productOptionId]: valueId };
        setSelectedOptions(nextOptions);
      }
    },
    [selectedOptions, product, router]
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
