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
    return await services.find({
      populate:'*',
      locale:locale
    });
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