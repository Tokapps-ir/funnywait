import { SmartPackage, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface MockSmartPackage {
  data: SmartPackage[];
  meta: Record<string, any>;
}

const MOCK_SMART_PACKAGES: Record<string, StrapiResponse<SmartPackage[]>> = {
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

export async function getSmartPackages(locale = 'fa'): Promise<StrapiResponse<SmartPackage|any[]>> {
  try {
    const smartPackageService=strapiSDK.collection('smart-packages');
    const response = await smartPackageService.find({
      locale:locale,
      sort:'sort_order:asc',
    });
    // Filter by enabled field
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.filter((item: any) => item.enabled !== false);
    }
    return response;
  } catch {
    console.warn('Using mock smart packages due to API error');
    return MOCK_SMART_PACKAGES[locale] ?? MOCK_SMART_PACKAGES.fa;
  }
}