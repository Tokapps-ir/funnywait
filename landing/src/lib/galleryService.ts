import { GalleryItem, GalleryGroup, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

// ─── Mock data ────────────────────────────────────────────────────────────────

type GroupRef = { id: number; documentId: string; slug: string; name: string };

const GF = (id: number, slug: string, name: string): GroupRef => ({
  id, documentId: `mock-gg-${id}`, slug, name,
});

const MOCK_GALLERY_GROUPS: Record<string, StrapiResponse<GalleryGroup[]>> = {
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

const MOCK_GALLERY_ITEMS: Record<string, StrapiResponse<GalleryItem[]>> = {
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


// ─── Public API ───────────────────────────────────────────────────────────────

export async function getGalleryGroups(locale = 'fa'): Promise<StrapiResponse<GalleryGroup|any[]>> {
  try {
    const galleryGroup=strapiSDK.collection('gallery-groups');
    return await galleryGroup.find({
      locale:locale,
      sort:'sort_order:asc',
    });
  } catch {
    // اگر Strapi در دسترس نیست یا permission تنظیم نشده، آرایه خالی برمی‌گردد
    // تا تب‌های فیلتر فقط وقتی داده واقعی از سرور باشد نشان داده شوند
    return { data: [], meta: {} };
  }
}

export async function getGalleryItems(locale = 'fa'): Promise<StrapiResponse<GalleryItem|any[]>> {
  try {
    const galleryItem= strapiSDK.collection('gallery-items');
    return await galleryItem.find(
        {
          populate:['image','gallery_groups'],
          sort:'sort_order:asc',
          locale:locale
        }

    );
  } catch (e) {
    console.error('Gallery items API failed, using mock:', e);
    return MOCK_GALLERY_ITEMS[locale] ?? MOCK_GALLERY_ITEMS.fa;
  }
}
