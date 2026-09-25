import { formatCurrency } from '@/shared/utils';

/**
 * Format attribute filter string: "<attribute_id>:<value1,value2>"
 */
export function formatAttributeParam(attributeId: number, values: string[]): string {
  return `${attributeId}:${values.join(',')}`;
}

/**
 * Parse attribute filter string: "1:Black,Blue" -> { attributeId: 1, values: ["Black", "Blue"] }
 */
export function parseAttributeParam(
  attrStr: string
): { attributeId: number; values: string[] } | null {
  if (!attrStr || !attrStr.includes(':')) return null;
  const [idStr, valuesStr] = attrStr.split(':');
  const attributeId = parseInt(idStr, 10);
  if (isNaN(attributeId)) return null;

  const values = valuesStr
    ? valuesStr
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  return { attributeId, values };
}

/**
 * Parse array of attribute strings into a Map<attributeId, values[]>
 */
export function parseAttributesList(attrStrings?: string[]): Map<number, string[]> {
  const map = new Map<number, string[]>();
  if (!attrStrings || !Array.isArray(attrStrings)) return map;

  for (const item of attrStrings) {
    const parsed = parseAttributeParam(item);
    if (parsed && parsed.values.length > 0) {
      map.set(parsed.attributeId, parsed.values);
    }
  }

  return map;
}

/**
 * Serialize Map<attributeId, values[]> back to array of strings
 */
export function serializeAttributesMap(map: Map<number, string[]>): string[] {
  const result: string[] = [];
  for (const [attributeId, values] of map.entries()) {
    if (values.length > 0) {
      result.push(formatAttributeParam(attributeId, values));
    }
  }
  return result;
}

/**
 * Format price using USD or VND depending on currency format
 */
export function formatPriceValue(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) return '—';
  return formatCurrency(price, 'USD', 'en-US');
}

/**
 * Format price range display (e.g. "$1,299.00 - $1,899.00" or "$1,299.00")
 */
export function formatPriceRange(
  minPrice: number | null | undefined,
  maxPrice: number | null | undefined
): string {
  if (minPrice === null || minPrice === undefined) {
    if (maxPrice !== null && maxPrice !== undefined) {
      return formatPriceValue(maxPrice);
    }
    return '—';
  }

  if (maxPrice === null || maxPrice === undefined || minPrice === maxPrice) {
    return formatPriceValue(minPrice);
  }

  return `${formatPriceValue(minPrice)} - ${formatPriceValue(maxPrice)}`;
}

/**
 * Map common color names to CSS color hex codes for visual color swatch badges
 */
export const COLOR_MAP: Record<string, string> = {
  black: '#171717',
  white: '#FFFFFF',
  silver: '#E5E7EB',
  gray: '#6B7280',
  grey: '#6B7280',
  blue: '#2563EB',
  navy: '#1E3A8A',
  red: '#DC2626',
  green: '#16A34A',
  yellow: '#CA8A04',
  gold: '#D97706',
  purple: '#9333EA',
  pink: '#EC4899',
  orange: '#EA580C',
  spacegray: '#4B5563',
  midnight: '#1E293B',
  starlight: '#F1F5F9',
  titanium: '#78716C',
};

export function getSwatchColor(value: string): string | null {
  const normalized = value.toLowerCase().replace(/[^a-z]/g, '');
  return COLOR_MAP[normalized] || null;
}
