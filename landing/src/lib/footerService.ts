import { Footer, StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

export async function getFooter(locale = 'fa'): Promise<StrapiResponse<Footer | any>> {
  try {
    const footer = strapiSDK.single('footer');
    return await footer.find({ locale: locale ,populate:"*" });
  } catch {
    console.warn('Using mock footer due to API error');
    return {
      data: {
        id: 1,
        documentId: 'mock-footer',
        brand_name: 'فانی‌ویت',
        brand_description: 'ما در فانی‌ویت معتقدیم که زمان انتظار نباید هدر برود. با استفاده از تکنولوژی‌های روز، ما این زمان را به فرصتی برای تعامل، شادی و رشد اقتصادی تبدیل می‌کنیم.',
        quick_links: [
          { text: 'صفحه اصلی', url: '#' },
          { text: 'ماشین حساب', url: '#calculator' },
          { text: 'محصولات', url: '#products' },
          { text: 'تماس با ما', url: '#' },
        ],
        certificates:
        [
          {
            certificate:'<img src="https://images.unsplash.com/photo-1518021327-9c5e18750b6a?w=50&h=150&fit=crop" />'
          },
        ],
        contact_address: 'تهران، خیابان آزادی، ناحیه نوآوری شریف',
        contact_phone: '۰۲۱-۱۲۳۴۵۶۷۸',
        contact_email: 'info@funnywait.ir',
        copyright_text: 'تمامی حقوق برای فانی‌ویت محفوظ است. ۱۴۰۴',
        terms_link: '#',
        privacy_link: '#',
      },
      meta: {},
    };
  }
}
