import { FeatureCard, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface MockFeatureCard {
  data: FeatureCard[];
  meta: Record<string, any>;
}

const MOCK_FEATURE_CARDS: Record<string, StrapiResponse<FeatureCard[]>> = {
  fa: {
    data: [
    ],
    meta: {},
  },
  en: {
    data: [
    ],
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

export async function getFeatureCards(locale = 'fa'): Promise<StrapiResponse<FeatureCard|any[]>> {
  try {
    const feature=strapiSDK.collection('feature-cards');

    return await feature.find({
      locale:locale,
      populate:'*',
      sort:'sort_order:asc'
    });
  } catch {
    console.warn('Using mock feature cards due to API error');
    return MOCK_FEATURE_CARDS[locale] ?? MOCK_FEATURE_CARDS.fa;
  }
}