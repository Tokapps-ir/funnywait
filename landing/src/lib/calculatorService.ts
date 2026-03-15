import { CalculatorConfig, StrapiResponse } from '../types';

interface MockCalc {
  data: CalculatorConfig;
  meta: Record<string, any>;
}

const MOCK_CALC: Record<string, StrapiResponse<CalculatorConfig>> = {
  fa: {
    data: {
      id: 1,
      documentId: 'mock-calc',
      default_visitors: 50,
      default_wait_time: 20,
      default_participation: 40,
      default_engagement: 10,
      default_attention_value: 500,
      default_conversion: 5,
      default_profit: 50000,
      subscription_cost: 1500000,
      high_profit_msg: 'سرمایه‌گذاری کاملاً توجیه‌پذیر است',
      mid_profit_msg: 'پتانسیل رشد بالا با بهینه‌سازی مشارکت',
      low_profit_msg: 'نیاز به افزایش تعامل کاربران',
      locale: 'fa',
    },
    meta: {},
  },
  en: {
    data: {
      id: 1,
      documentId: 'mock-calc',
      default_visitors: 50,
      default_wait_time: 20,
      default_participation: 40,
      default_engagement: 10,
      default_attention_value: 500,
      default_conversion: 5,
      default_profit: 50000,
      subscription_cost: 1500000,
      high_profit_msg: 'Investment is fully justified',
      mid_profit_msg: 'High growth potential with participation optimization',
      low_profit_msg: 'User engagement needs improvement',
      locale: 'en',
    },
    meta: {},
  },
};

const STRAPI_URL = (import.meta.env && import.meta.env.VITE_STRAPI_URL) ? import.meta.env.VITE_STRAPI_URL : 'http://127.0.0.1:1337';
const STRAPI_API_TOKEN = (import.meta.env && import.meta.env.VITE_STRAPI_API_TOKEN) ? import.meta.env.VITE_STRAPI_API_TOKEN as string : undefined;

async function strapiGet<T>(path: string): Promise<T> {
  const headers: HeadersInit = STRAPI_API_TOKEN
    ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
    : {};
  const res = await fetch(`${STRAPI_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`Strapi ${res.status}: ${path}`);
  return res.json();
}

export async function getCalculatorConfig(
  locale = 'fa',
): Promise<StrapiResponse<CalculatorConfig>> {
  try {
    return await strapiGet(`/api/calculator-config?locale=${locale}`);
  } catch {
    console.warn('Using mock calculator config due to API error');
    return MOCK_CALC[locale] ?? MOCK_CALC.fa;
  }
}