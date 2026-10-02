export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    VERIFY_EMAIL: '/verify-email',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    OAUTH_CALLBACK: (provider: string) => `/oauth2/callback/${provider}` as const,
  },
  ACCOUNT: {
    PROFILE: '/profile',
    ORDERS: '/orders',
    ORDER_DETAIL: (id: string) => `/orders/${id}` as const,
  },
  SHOP: {
    CATALOG: '/products',
    PRODUCT_DETAIL: (id: string) => `/products/${id}` as const,
    CATEGORY_DETAIL: (slug: string) => `/categories/${slug}` as const,
    SEARCH: '/search',
    CART: '/cart',
    CHECKOUT: '/checkout',
    CHECKOUT_SUCCESS: '/checkout/success',
  },
} as const;
