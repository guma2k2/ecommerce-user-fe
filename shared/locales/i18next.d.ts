import 'i18next';
import type { common, auth, cart, products, orders } from './en';

export interface I18nResources {
  common: typeof common;
  auth: typeof auth;
  cart: typeof cart;
  products: typeof products;
  orders: typeof orders;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nResources;
  }
}
