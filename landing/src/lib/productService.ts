import { Product, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface MockProduct {
  data: Product[];
  meta: Record<string, any>;
}

const MOCK_PRODUCTS: Record<string, StrapiResponse<Product[]>> = {
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

export async function getProducts(locale = 'fa'): Promise<StrapiResponse<Product|any[]>> {
  try {
    const products=strapiSDK.collection('products');
    return await products.find({
      populate:'*',
      locale:locale
    });
  } catch {
    console.warn('Using mock products due to API error');
    return MOCK_PRODUCTS[locale] ?? MOCK_PRODUCTS.fa;
  }
}