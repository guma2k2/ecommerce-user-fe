import type { CartItem } from '../types';

/**
 * Calculates sum of quantity and subtotal for a list of cart items
 */
export function calculateCartTotals(items: CartItem[] = []): {
  totalQuantity: number;
  totalPrice: number;
} {
  return items.reduce(
    (acc, item) => ({
      totalQuantity: acc.totalQuantity + (item.quantity || 0),
      totalPrice: acc.totalPrice + (item.subtotal || 0),
    }),
    { totalQuantity: 0, totalPrice: 0 }
  );
}

/**
 * Checks if a cart item's requested quantity exceeds available inventory
 */
export function isItemStockExceeded(item: CartItem): boolean {
  return item.quantity > item.variant.stockQuantity;
}

/**
 * Checks if a cart item is completely out of stock
 */
export function isItemOutOfStock(item: CartItem): boolean {
  return item.variant.stockQuantity <= 0;
}

/**
 * Formats badge text for cart counter (e.g., 99+)
 */
export function formatCartBadgeCount(count: number): string {
  if (count <= 0) return '0';
  if (count > 99) return '99+';
  return String(count);
}
