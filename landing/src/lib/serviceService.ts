import { StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface Service {
  id: number;
  documentId: string;
  title: string;
  description: string;
  features: string;
  icon: string;
  locale: string;
}


export async function getServices(locale = 'fa'): Promise<StrapiResponse<Service|any[]>> {
  try {
    const services=strapiSDK.collection('services');
    const response = await services.find({
      populate:'*',
      locale:locale
    });
    // Filter by enabled field
    if (response.data && Array.isArray(response.data)) {
      response.data = response.data.filter((item: any) => item.enabled !== false);
    }
    return response;
  } catch {
    console.warn('Using mock services due to API error');
    // Return mock data structure similar to other components
    return {
      data: [

      ],
      meta: {}
    };
  }
}