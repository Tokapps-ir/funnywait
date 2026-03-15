import { factories } from '@strapi/strapi';

export default {
  async afterInstall() {
    // Create sample customers
    const customerService = strapi.service('api::customer.customer');
    
    const sampleCustomers = [
      {
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
      },
      {
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
      },
      {
        name: 'استارتاپ هوش مصنوعی',
        logo_text: 'AI',
        description: 'پروژه‌های هوش مصنوعی',
        website: 'https://aistartup.ir',
        industry: 'AI/ML',
        employees: 25,
        revenue: '$1M',
        founded: '2021',
        street: '789 AI Boulevard',
        city: 'مشهد',
        country: 'ایران',
        phone: '+98 51 11 2222',
        email: 'hello@aistartup.ir',
        partnership_date: '2023-03-10',
        sort_order: 3,
      },
      {
        name: 'شرکت دیجیتال نوین',
        logo_text: 'DN',
        description: 'راهکارهای دیجیتال',
        website: 'https://digitalcompany.ir',
        industry: 'Digital Services',
        employees: 50,
        revenue: '$2M',
        founded: '2019',
        street: '321 Digital Road',
        city: 'شیراز',
        country: 'ایران',
        phone: '+98 71 333 4444',
        email: 'support@digitalcompany.ir',
        partnership_date: '2023-06-01',
        sort_order: 4,
      },
      {
        name: 'گروه فناوری مدرن',
        logo_text: 'MT',
        description: 'فناوری‌های نوین',
        website: 'https://modern-tech.ir',
        industry: 'Innovation',
        employees: 120,
        revenue: '$8M',
        founded: '2017',
        street: '555 Innovation St',
        city: 'تبریز',
        country: 'ایران',
        phone: '+98 41 555 6666',
        email: 'contact@modern-tech.ir',
        partnership_date: '2022-1-05',
        sort_order: 5,
      },
      {
        name: 'شرکت ابری پیشرو',
        logo_text: 'CC',
        description: 'خدمات ابری',
        website: 'https://cloudcompany.ir',
        industry: 'Cloud Services',
        employees: 80,
        revenue: '$4M',
        founded: '2020',
        street: '777 Cloud Avenue',
        city: 'قم',
        country: 'ایران',
        phone: '+98 25 777 8888',
        email: 'info@cloudcompany.ir',
        partnership_date: '2023-02-14',
        sort_order: 6,
      }
    ];

    for (const customerData of sampleCustomers) {
      try {
        await customerService.create({
          data: customerData,
        });
        console.log(`Created customer: ${customerData.name}`);
      } catch (error) {
        console.error(`Error creating customer ${customerData.name}:`, error);
      }
    }
  },
};