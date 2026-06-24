import { BusinessPartner, StrapiResponse } from '../types';
import strapiSDK from "./strapi";

interface MockBusinessPartner {
  data: BusinessPartner[];
  meta: Record<string, any>;
}

const MOCK_BUSINESS_PARTNERS: Record<string, StrapiResponse<BusinessPartner[]>> = {
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

export async function getBusinessPartners(locale = 'fa'):  Promise<any> {
  try {
    const businessPartners=strapiSDK.collection('business-partners');
    const response = await businessPartners.find({
      populate:'*',
      sort:'sort_order:asc',
      locale: locale,
    });
    // Filter by enabled field
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.filter((item: any) => item.enabled !== false);
    }
    return response;
  } catch (error) {
    console.error('Business partner API error:', error);
    console.warn('Using mock business partners due to API error');
    return MOCK_BUSINESS_PARTNERS[locale] ?? MOCK_BUSINESS_PARTNERS.fa;
  }
}
