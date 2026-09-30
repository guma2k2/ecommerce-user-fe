/**
 * Option selected for a product variant (e.g. Color: Space Black)
 */
export interface CartVariantOption {
  id: number;
  name: string;
  value: string;
}

/**
 * Cart product variant data embedded in each line item
 */
export interface CartVariant {
  variantId: number;
  productId: number;
  productName: string;
  productSlug: string;
  thumbnailUrl: string | null;
  stockQuantity: number;
  sku: string;
  price: number;
  options?: CartVariantOption[];
}

/**
 * Single line item in the customer shopping cart
 */
export interface CartItem {
  cartId: number;
  variant: CartVariant;
  quantity: number;
  subtotal: number;
}

/**
 * Complete customer shopping cart response
 */
export interface Cart {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

/**
 * Payload for adding an item to the shopping cart
 */
export interface AddToCartRequest {
  productVariantId: number;
  quantity: number;
}

/**
 * Payload for updating an item's quantity in the shopping cart
 */
export interface UpdateCartQuantityRequest {
  quantity: number;
}

/**
 * Parameter object for updating item quantity
 */
export interface UpdateCartItemParams {
  cartId: number;
  quantity: number;
}

/**
 * Standard cart action error types returned by backend
 */
export type CartErrorCode =
  | 'cart_item_not_found'
  | 'product_variant_not_found'
  | 'insufficient_stock'
  | 'product_variant_inactive'
  | 'unauthenticated'
  | string;
