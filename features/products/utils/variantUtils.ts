import type {
  ProductDetail,
  ProductVariant,
  OptionValueStatus,
} from '../types';

/**
 * Checks if a variant matches a set of selected options
 */
export function isVariantMatch(
  variant: ProductVariant,
  selectedOptions: Record<number, number>
): boolean {
  const selectedValues = Object.values(selectedOptions);
  if (selectedValues.length === 0) return false;
  return selectedValues.every((valId) =>
    variant.productOptionValueIds.includes(valId)
  );
}

/**
 * Finds an exact matching variant for the given selected options
 */
export function findExactVariant(
  product?: ProductDetail | null,
  selectedOptions?: Record<number, number>
): ProductVariant | null {
  if (!product?.variants || !selectedOptions) return null;

  const selectedValues = Object.values(selectedOptions);
  if (selectedValues.length === 0) return null;

  return (
    product.variants.find(
      (v) =>
        selectedValues.every((valId) =>
          v.productOptionValueIds.includes(valId)
        ) && v.productOptionValueIds.length === selectedValues.length
    ) || null
  );
}

/**
 * Finds the best existing variant containing the target option value.
 * Used when a user clicks a value that cannot combine with the current selection,
 * smartly auto-switching the other options to the nearest valid variant.
 */
export function findBestMatchingVariant(
  product: ProductDetail,
  targetOptionId: number,
  targetValueId: number,
  currentSelectedOptions: Record<number, number>
): ProductVariant | null {
  if (!product.variants || product.variants.length === 0) return null;

  // 1. Direct check: can we just keep current options and swap this one?
  const hypotheticalOptions = {
    ...currentSelectedOptions,
    [targetOptionId]: targetValueId,
  };
  const exact = findExactVariant(product, hypotheticalOptions);
  if (exact) return exact;

  // 2. Candidates: all variants containing targetValueId
  const candidates = product.variants.filter((v) =>
    v.productOptionValueIds.includes(targetValueId)
  );
  if (candidates.length === 0) return null;

  // 3. Score candidates by how many other current options they share
  const sortedOptions = [...product.options].sort(
    (a, b) => a.position - b.position
  );
  let bestVariant = candidates[0];
  let bestScore = -1;

  for (const candidate of candidates) {
    let score = 0;
    // Prefer in-stock items
    if (candidate.quantity > 0) score += 100;

    // Award points for matching other selected options, weighted by priority
    for (const opt of sortedOptions) {
      if (opt.productOptionId === targetOptionId) continue;
      const currentVal = currentSelectedOptions[opt.productOptionId];
      if (currentVal && candidate.productOptionValueIds.includes(currentVal)) {
        // Higher priority options (lower position index) get more weight
        score += 10 + Math.max(0, 10 - opt.position);
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestVariant = candidate;
    }
  }

  return bestVariant;
}

/**
 * Determines the visual and interactive status of an option value:
 * - 'selected': Active value in current configuration
 * - 'available': Valid combination with active selections and has stock (> 0)
 * - 'out_of_stock': Valid combination with active selections but stock == 0
 * - 'disabled': Cannot constitute an existing variant in current context (or at all)
 */
export function getOptionValueStatus(
  product: ProductDetail | null | undefined,
  selectedOptions: Record<number, number>,
  optionId: number,
  valueId: number
): OptionValueStatus {
  if (!product?.variants || product.variants.length === 0) {
    return 'disabled';
  }

  // 1. Currently selected check
  if (selectedOptions[optionId] === valueId) {
    return 'selected';
  }

  // 2. Does this value exist in ANY variant of the product?
  const variantsWithValue = product.variants.filter((v) =>
    v.productOptionValueIds.includes(valueId)
  );
  if (variantsWithValue.length === 0) {
    return 'disabled';
  }

  // 3. Hierarchical / Contextual availability check
  const sortedOptions = [...(product.options || [])].sort(
    (a, b) => a.position - b.position
  );
  const currentOptionIndex = sortedOptions.findIndex(
    (o) => o.productOptionId === optionId
  );

  // Position 1 (Primary / Root option, e.g. Color): Always selectable if at least one variant exists
  if (currentOptionIndex <= 0) {
    const hasStock = variantsWithValue.some((v) => v.quantity > 0);
    return hasStock ? 'available' : 'out_of_stock';
  }

  // Dependent / downstream options: Must combine with higher-priority selections
  const higherPriorityOptionIds = sortedOptions
    .slice(0, currentOptionIndex)
    .map((o) => o.productOptionId);

  const higherPriorityValues = higherPriorityOptionIds
    .map((optId) => selectedOptions[optId])
    .filter(Boolean);

  const matchingVariants = variantsWithValue.filter((v) =>
    higherPriorityValues.every((valId) =>
      v.productOptionValueIds.includes(valId)
    )
  );

  // If no variant exists combining this value with higher-priority choices
  if (matchingVariants.length === 0) {
    return 'disabled';
  }

  const hasStock = matchingVariants.some((v) => v.quantity > 0);
  return hasStock ? 'available' : 'out_of_stock';
}
