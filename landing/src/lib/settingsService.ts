import strapiSDK from "@/src/lib/strapi.ts";
import {Settings,StrapiResponse} from "@/src/types.ts";

interface MockSetting {
    data: Settings;
    meta: Record<string, any>;
}

const MOCK_SETTINGS: Record<string, StrapiResponse<Settings>> = {
    fa: {
        data: {
            "brand_name":"فانی ویت"
        },
        meta: {},
    },
    en: {
        data: {
            "brand_name":"FunnyWait"
        },
        meta: {},
    },
};

export async function getSettings(locale = 'fa'): Promise<StrapiResponse<Settings|any>> {
    try {
        const setting=strapiSDK.single('setting');
        return await setting.find({
            populate:'*',
            locale:locale
        });
    } catch {
        console.warn('Using mock Setting due to API error');
        return MOCK_SETTINGS[locale] ?? MOCK_SETTINGS.fa;
    }
}