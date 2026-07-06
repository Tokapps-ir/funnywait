import { HeroConfig, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface MockHero {
  data: HeroConfig;
  meta: Record<string, any>;
}





export async function getHeroConfig(locale = 'fa'): Promise<StrapiResponse<HeroConfig|any>> {
  try {
    const hero=strapiSDK.single('hero-config');
    return await hero.find({locale:locale,populate:"*"});
  } catch {
    console.warn('Using mock hero config due to API error');
  }
}