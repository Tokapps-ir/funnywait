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



export async function getFeatureCards(locale = 'fa'): Promise<StrapiResponse<FeatureCard[]|any[]>> {
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