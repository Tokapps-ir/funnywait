import { FeaturesConfig, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface MockFeaturesConfig {
  data: FeaturesConfig;
  meta: Record<string, any>;
}

const MOCK_FEATURES_CONFIG: Record<string, StrapiResponse<any>> = {
  fa: {
    data: {

    },
    meta: {},
  },
  en: {
    data: {

    },
    meta: {},
  },
};



export async function getFeaturesConfig(locale = 'fa'): Promise<StrapiResponse<any>> {
  try {
    const featuresConfig=strapiSDK.single('features-config');
    return await featuresConfig.find({
      locale:locale
    });
  } catch {
    console.warn('Using mock features config due to API error');
    return MOCK_FEATURES_CONFIG[locale] ?? MOCK_FEATURES_CONFIG.fa;
  }
}