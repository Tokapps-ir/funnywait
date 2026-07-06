// src/app/page.tsx
import React from 'react';

import { getProducts } from '../lib/productService';
import { getCalculatorConfig } from '../lib/calculatorService';
import { getHeroConfig } from '../lib/heroService';
import { getFeaturesConfig } from '../lib/featuresService';
import { getFeatureCards } from '../lib/featureCardService';
import { getSmartPackages } from '../lib/smartPackageService';
import { getGalleryItems, getGalleryGroups } from '../lib/galleryService';
import { getTestimonials } from '../lib/testimonialService';
import { getSettings } from '../lib/settingsService';
import {MainBusinessPageProps, SmartPackage} from '../types';
import { Metadata } from 'next';
import BusinessMainClient from "@/src/components/client/BusinessMainClient.tsx";

// Dynamic Server Metadata Engine replaces `document.title`
export async function generateMetadata(): Promise<Metadata> {
    const settingsRes = await getSettings('fa');
    return {
        title: settingsRes?.data?.brand_name || 'Default Brand Name',
    };
}

export default async function Page() {
    const locale = 'fa'; // Default or extracted via middleware parameter route

    // Concurrent server-side secure fetches
    const [
        settingsRes,
        prodRes,
        calcRes,
        heroRes,
        featuresConfigRes,
        featureCardsRes,
        smartPkgRes,
        galleryRes,
        galleryGroupsRes,
        testimonialsRes
    ] = await Promise.all([
        getSettings(locale),
        getProducts(locale),
        getCalculatorConfig(locale),
        getHeroConfig(locale),
        getFeaturesConfig(locale),
        getFeatureCards(locale),
        getSmartPackages(locale),
        getGalleryItems(locale),
        getGalleryGroups(locale),
        getTestimonials(locale),
    ]);

    // @ts-ignore
    const mappedSmartPackages = smartPkgRes.data?.filter((sp: SmartPackage) => sp.package_key && sp.name)
        .map((sp: SmartPackage) => ({
            id: sp.package_key,
            name: sp.name,
            products: sp.products?.split('\n').filter(Boolean) ?? [],
            advantage: sp.advantage ?? '',
            responseTime: sp.response_time ?? '',
            priceRange: sp.price_range ?? '',
            minBudget: sp.min_budget ?? 0,
        })) ?? [];

    const initialData :MainBusinessPageProps= {
        settings: settingsRes?.data || null,
        products: prodRes?.data || [],
        calcConfig: calcRes?.data || null,
        heroConfig: heroRes?.data || null,
        featuresConfig: featuresConfigRes?.data || null,
        featureCards: featureCardsRes?.data || [],
        smartPackages: mappedSmartPackages,
        galleryItems: galleryRes?.data || [],
        galleryGroups: galleryGroupsRes?.data || [],
        testimonials: testimonialsRes?.data || [],
    };

    return <BusinessMainClient initialData={initialData} />;
}