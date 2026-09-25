export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },
  customer: {
    all: ['customer'] as const,
    profile: () => [...queryKeys.customer.all, 'profile'] as const,
  },
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.products.lists(), filters] as const,
    infinite: (filters: Record<string, unknown>) => [...queryKeys.products.all, 'infinite', filters] as const,
    detail: (id: string) => [...queryKeys.products.all, 'detail', id] as const,
  },
  cart: {
    root: ['cart'] as const,
  },
  search: {
    all: ['search'] as const,
    suggestions: (keyword: string, limit?: number) =>
      [...queryKeys.search.all, 'suggestions', keyword, limit ?? 5] as const,
    results: (params: Record<string, unknown>) =>
      [...queryKeys.search.all, 'results', params] as const,
    facets: (categoryId: number) =>
      [...queryKeys.search.all, 'facets', categoryId] as const,
  },
} as const;
