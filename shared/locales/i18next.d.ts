import 'i18next';
import type { common, auth, cart, products, orders, checkout, payment, home } from './en';

export interface I18nResources {
  common: typeof common;
  auth: typeof auth;
  cart: typeof cart;
  products: typeof products;
  orders: typeof orders;
  checkout: typeof checkout;
  payment: typeof payment;
  home: typeof home;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nResources;
  }
}
