import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type {
  AddToCartRequest,
  Cart,
  UpdateCartQuantityRequest,
} from '../types';

export const cartService = {
  /**
   * Fetches active cart for the authenticated customer
   * Endpoint: GET /api/v1/carts
   */
  getCart: async (): Promise<Cart> => {
    const response = await httpRequest.get<ApiResponse<Cart>>('/carts');
    return response.data.data;
  },

  /**
   * Adds an item / variant to the customer's cart
   * Endpoint: POST /api/v1/carts
   */
  addToCart: async (payload: AddToCartRequest): Promise<Cart> => {
    const response = await httpRequest.post<ApiResponse<Cart>>('/carts', payload);
    return response.data.data;
  },

  /**
   * Updates quantity of a specific cart line item
   * Endpoint: PUT /api/v1/carts/{cartId}
   */
  updateQuantity: async (
    cartId: number,
    payload: UpdateCartQuantityRequest
  ): Promise<Cart> => {
    const response = await httpRequest.put<ApiResponse<Cart>>(
      `/carts/${cartId}`,
      payload
    );
    return response.data.data;
  },

  /**
   * Removes a single line item from the cart
   * Endpoint: DELETE /api/v1/carts/{cartId}
   */
  deleteCartItem: async (cartId: number): Promise<void> => {
    await httpRequest.delete<ApiResponse<null>>(`/carts/${cartId}`);
  },

  /**
   * Clears all items in the customer's cart
   * Endpoint: DELETE /api/v1/carts
   */
  clearCart: async (): Promise<void> => {
    await httpRequest.delete<ApiResponse<null>>('/carts');
  },
};
