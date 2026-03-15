import { StrapiResponse } from '../types';
import strapiSDK from "@/src/lib/strapi.ts";

interface MockCustomer {
  data: any[];
  meta: Record<string, any>;
}

const MOCK_CUSTOMERS: Record<string, StrapiResponse<any[]>> = {
 fa: {
    data: [
      {
        id: 1,
        documentId: 'mock-customer-1',
        name: 'شرکت فناوری پیشرو',
        logo_text: 'PF',
        description: 'خدمات فناوری پیشرفته',
        website: 'https://techcompany.com',
        industry: 'Technology',
        employees: 100,
        revenue: '$5M',
        founded: '2018',
        street: '123 Tech Street',
        city: 'تهران',
        country: 'ایران',
        phone: '+98 21 1234 5678',
        email: 'contact@techcompany.com',
        partnership_date: '2023-01-15',
        sort_order: 1,
        locale: 'fa',
        gallery: [
          {
            id: 1,
            name: 'office.jpg',
            url: 'https://placehold.co/300x20/2563eb/white?text=Office+1',
          },
          {
            id: 2,
            name: 'team.jpg',
            url: 'https://placehold.co/300x200/7c3aed/white?text=Team+Photo',
          },
          {
            id: 3,
            name: 'event.jpg',
            url: 'https://placehold.co/300x200/dc2626/white?text=Event',
          },
          {
            id: 4,
            name: 'product.jpg',
            url: 'https://placehold.co/300x200/ea580c/white?text=Product',
          }
        ]
      },
      {
        id: 2,
        documentId: 'mock-customer-2',
        name: 'شرکت نرم‌افزاری آرمان',
        logo_text: 'SA',
        description: 'راهکارهای نرم‌افزاری',
        website: 'https://softwarecompany.ir',
        industry: 'Software',
        employees: 75,
        revenue: '$3M',
        founded: '2020',
        street: '456 Software Ave',
        city: 'اصفهان',
        country: 'ایران',
        phone: '+98 31 8765 4321',
        email: 'info@softwarecompany.ir',
        partnership_date: '2022-08-20',
        sort_order: 2,
        locale: 'fa',
        gallery: [
          {
            id: 1,
            name: 'hq.jpg',
            url: 'https://placehold.co/300x200/7c3aed/white?text=HQ+Building',
          },
          {
            id: 2,
            name: 'lab.jpg',
            url: 'https://placehold.co/300x200/dc2626/white?text=R&D+Lab',
          },
          {
            id: 3,
            name: 'conference.jpg',
            url: 'https://placehold.co/300x200/2563eb/white?text=Conference',
          },
          {
            id: 4,
            name: 'training.jpg',
            url: 'https://placehold.co/300x200/ea580c/white?text=Training',
          }
        ]
      }
    ],
    meta: {},
  },
  en: {
    data: [
      {
        id: 1,
        documentId: 'mock-customer-1',
        name: 'Progressive Technology Co.',
        logo_text: 'PT',
        description: 'Advanced technology services',
        website: 'https://techcompany.com',
        industry: 'Technology',
        employees: 100,
        revenue: '$5M',
        founded: '2018',
        street: '123 Tech Street',
        city: 'Tehran',
        country: 'Iran',
        phone: '+98 21 1234 5678',
        email: 'contact@techcompany.com',
        partnership_date: '2023-01-15',
        sort_order: 1,
        locale: 'en',
        gallery: [
          {
            id: 1,
            name: 'office.jpg',
            url: 'https://placehold.co/300x200/2563eb/white?text=Office+1',
          },
          {
            id: 2,
            name: 'team.jpg',
            url: 'https://placehold.co/300x200/7c3aed/white?text=Team+Photo',
          },
          {
            id: 3,
            name: 'event.jpg',
            url: 'https://placehold.co/300x200/dc2626/white?text=Event',
          },
          {
            id: 4,
            name: 'product.jpg',
            url: 'https://placehold.co/300x200/ea580c/white?text=Product',
          }
        ]
      }
    ],
    meta: {},
  },
};




export async function getCustomers(locale = 'fa'): Promise<StrapiResponse<any[]>> {
  try {
    const customers=strapiSDK.collection('customers');
    return await customers.find({
      populate:'gallery',
      sort:'sort_order:asc',
      locale:locale
    });
  } catch {
    console.warn('Using mock customers due to API error');
    return MOCK_CUSTOMERS[locale] ?? MOCK_CUSTOMERS.fa;
  }
}