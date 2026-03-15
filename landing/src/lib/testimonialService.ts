import { StrapiResponse, Testimonial } from '../types';
import strapiSDK from '@/src/lib/strapi';

const MOCK_TESTIMONIALS: Record<string, StrapiResponse<Testimonial[]>> = {
  fa: {
    data: [
      {
        id: 1,
        documentId: 'mock-testimonial-1',
        name: 'علی محمدی',
        role: 'مدیر آرایشگاه کلاسیک',
        text: 'فانی‌ویت واقعاً تجربه انتظار مشتریان ما رو دگرگون کرد. حالا همه با لبخند منتظر نوبتشون می‌مونن.',
        rating: 5,
        avatar: null,
        sort_order: 1,
        locale: 'fa',
      },
      {
        id: 2,
        documentId: 'mock-testimonial-2',
        name: 'سارا احمدی',
        role: 'مدیر کلینیک زیبایی ونوس',
        text: 'افزایش فروش خدمات جانبی ما بعد از نصب فانی‌ویت چشمگیر بود. یک سرمایه‌گذاری هوشمندانه.',
        rating: 5,
        avatar: null,
        sort_order: 2,
        locale: 'fa',
      },
      {
        id: 3,
        documentId: 'mock-testimonial-3',
        name: 'رضا علوی',
        role: 'مدیر مرکز درمانی پاستور',
        text: 'کاهش استرس بیماران در اتاق انتظار یکی از بزرگترین دستاوردهای ما با این سیستم بود.',
        rating: 5,
        avatar: null,
        sort_order: 3,
        locale: 'fa',
      },
    ],
    meta: {},
  },
  en: {
    data: [
      {
        id: 1,
        documentId: 'mock-testimonial-1',
        name: 'Ali Mohammadi',
        role: 'Classic Barbershop Manager',
        text: 'FunnyWait really transformed our customers waiting experience. Now everyone waits for their turn with a smile.',
        rating: 5,
        avatar: null,
        sort_order: 1,
        locale: 'en',
      },
      {
        id: 2,
        documentId: 'mock-testimonial-2',
        name: 'Sarah Ahmadi',
        role: 'Venus Beauty Clinic Manager',
        text: 'Our side services sales increased significantly after installing FunnyWait. A smart investment.',
        rating: 5,
        avatar: null,
        sort_order: 2,
        locale: 'en',
      },
      {
        id: 3,
        documentId: 'mock-testimonial-3',
        name: 'Reza Alavi',
        role: 'Pasteur Medical Center Manager',
        text: 'Reducing patient stress in the waiting room was one of our biggest achievements with this system.',
        rating: 5,
        avatar: null,
        sort_order: 3,
        locale: 'en',
      },
    ],
    meta: {},
  },
};

export async function getTestimonials(locale = 'fa'): Promise<StrapiResponse<Testimonial[] | any[]>> {
  try {
    const testimonials = strapiSDK.collection('testimonials');
    const response = await testimonials.find({
      sort: 'sort_order:asc',
      locale: locale,
    });
    // If API returns empty data, use mock data
    if (!response.data || response.data.length === 0) {
      console.warn('API returned empty testimonials, using mock data');
      return MOCK_TESTIMONIALS[locale] ?? MOCK_TESTIMONIALS.fa;
    }
    // Map API fields to Testimonial interface
    const mappedData = response.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.author_name,
      role: item.company + (item.position ? ` - ${item.position}` : ''),
      text: item.comment,
      rating: item.rating,
      avatar: item.avatar || null,
      sort_order: item.sort_order,
      locale: item.locale,
    }));
    return { data: mappedData, meta: response.meta };
  } catch (error) {
    console.warn('Using mock testimonials due to API error:', error);
    return MOCK_TESTIMONIALS[locale] ?? MOCK_TESTIMONIALS.fa;
  }
}
