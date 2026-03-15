// ─── Helpers ──────────────────────────────────────────────────

export const toPersianDigits = (n: number | string): string => {
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return n.toString().replace(/\d/g, (x) => persian[parseInt(x)]);
};

export const formatCurrency = (n: number): string => {
  return toPersianDigits(n.toLocaleString('fa-IR'));
};

const STRAPI_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRAPI_URL)
  ? import.meta.env.VITE_STRAPI_URL
  : 'http://127.0.0.1:1337';

export const getStrapiMediaUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${STRAPI_URL}${url}`;
};