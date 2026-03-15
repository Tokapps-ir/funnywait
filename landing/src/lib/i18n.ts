import { createContext, useContext } from 'react';

export type Locale = 'fa' | 'en';

export interface I18nContext {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string) => string;
}

// Static UI strings not managed by Strapi (nav, loading states, etc.)
export const translations: Record<Locale, Record<string, string>> = {
  fa: {
    loading: 'فانی‌ویت در حال بارگذاری...',
    nav_features: 'ویژگی‌ها',
    nav_calculator: 'ماشین حساب',
    nav_smart: 'پیشنهاد هوشمند',
    nav_products: 'محصولات',
    nav_gallery: 'گالری',
    nav_testimonials: 'نظرات',
    nav_music_label: 'موسیقی متن',
    nav_music_on: 'در حال پخش',
    nav_music_off: 'خاموش',
    nav_cta: 'شروع کنید',
    lang_switch: 'EN',
  },
  en: {
    loading: 'FunnyWait is loading...',
    nav_features: 'Features',
    nav_calculator: 'Calculator',
    nav_smart: 'Smart Suggest',
    nav_products: 'Products',
    nav_gallery: 'Gallery',
    nav_testimonials: 'Reviews',
    nav_music_label: 'Background Music',
    nav_music_on: 'Playing',
    nav_music_off: 'Muted',
    nav_cta: 'Get Started',
    lang_switch: 'فا',
  },
};

export const LanguageContext = createContext<I18nContext>({
  locale: 'fa',
  setLocale: () => {},
  dir: 'rtl',
  t: (key) => key,
});

export const useI18n = () => useContext(LanguageContext);
