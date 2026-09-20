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
  },
  SHOP: {
    CATALOG: '/products',
    PRODUCT_DETAIL: (id: string) => `/products/${id}` as const,
    SEARCH: '/search',
    CART: '/cart',
    CHECKOUT: '/checkout',
  },
} as const;
