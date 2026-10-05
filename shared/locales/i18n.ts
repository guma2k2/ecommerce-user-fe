import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '@/shared/constants';

import * as enResources from './en';
import * as viResources from './vi';

export const SUPPORTED_LANGUAGES = ['en', 'vi'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

export const resources = {
  en: enResources,
  vi: viResources,
} as const;

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window !== 'undefined') {
    const saved = sessionStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved && (SUPPORTED_LANGUAGES as readonly string[]).includes(saved)) {
      return saved as SupportedLanguage;
    }
  }
  return DEFAULT_LANGUAGE;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    defaultNS: 'common',
    ns: ['common', 'auth', 'cart', 'products', 'orders'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export const setLanguage = (lang: SupportedLanguage) => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    document.documentElement.lang = lang;
  }
  return i18n.changeLanguage(lang);
};

export default i18n;
