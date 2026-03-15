import { Package, CalculatorState, RecommendationResult } from '../types';
import strapiSDK from './strapi';

// Define the Strapi smart package type to match the API response
interface StrapiSmartPackageAttributes {
  package_key: string;
  name: string;
  products: string;
  advantage: string;
  response_time: string;
  price_range: string;
  min_budget: number;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface StrapiSmartPackage {
  id: number;
  attributes: StrapiSmartPackageAttributes;
}

// Convert Strapi response to our Package type
const convertStrapiPackageToPackage = (strapiPackage: { id: number; attributes: StrapiSmartPackageAttributes }): Package => {
  const { package_key, name, products, advantage, response_time, price_range, min_budget } = strapiPackage.attributes;
  
  // Split products string by newlines to create an array
  const productArray = products ? products.split('\n').filter(item => item.trim()) : [];
  
  return {
    id: package_key,
    name,
    products: productArray,
    advantage,
    responseTime: response_time,
    priceRange: price_range,
    minBudget: min_budget,
  };
};

// Fetch packages from Strapi API
export const fetchPackages = async (): Promise<Package[]> => {
  try {
    const smartPackages = strapiSDK.collection('smart-packages');
    const response = await smartPackages.find({
      pagination: {
        pageSize: 100
      },
      sort: 'sort_order:asc'
    });
    
    if (response.data && Array.isArray(response.data)) {
      return (response.data as unknown as Array<{ id: number; attributes: StrapiSmartPackageAttributes }>).map(convertStrapiPackageToPackage);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching packages from Strapi:', error);
    // Return fallback packages if API fails
    return [
      {
        id: 'economic',
        name: 'پکیج اقتصادی',
        products: ['سیستم نوبت‌دهی پایه', '۳ بازی کلاسیک', 'گزارش‌دهی ماهانه'],
        advantage: 'بهترین گزینه برای شروع با کمترین هزینه و مدیریت اولیه مراجعین.',
        responseTime: '۴۸ ساعت',
        priceRange: '۱ تا ۳ میلیون تومان',
        minBudget: 1000000,
      },
      {
        id: 'standard',
        name: 'پکیج استاندارد',
        products: ['سیستم نوبت‌دهی پیشرفته', '۱۰ بازی متنوع', 'شخصی‌سازی محدود برند', 'گزارش‌دهی هفتگی'],
        advantage: 'تعادل عالی بین قیمت و امکانات برای کسب‌وکارهای در حال رشد.',
        responseTime: '۲۴ ساعت',
        priceRange: '۳ تا ۷ میلیون تومان',
        minBudget: 3000000,
      },
      {
        id: 'professional',
        name: 'پکیج حرفه‌ای',
        products: ['سیستم مدیریت کامل', 'تمامی بازی‌ها', 'شخصی‌سازی کامل برند', 'پشتیبانی اولویت‌دار', 'تحلیل هوشمند رفتار'],
        advantage: 'تجربه‌ای بی‌نظیر برای برندهای مطرح که به دنبال تمایز هستند.',
        responseTime: '۱۲ ساعت',
        priceRange: '۷ تا ۱۵ میلیون تومان',
        minBudget: 7000000,
      },
      {
        id: 'enterprise',
        name: 'پکیج سازمانی',
        products: ['زیرساخت اختصاصی', 'بازی‌های سفارشی', 'اتصال به CRM', 'مدیریت متمرکز شعب', 'امنیت سطح بالا'],
        advantage: 'راهکاری جامع و مقیاس‌پذیر برای مجموعه‌های بزرگ و زنجیره‌ای.',
        responseTime: '۴ ساعت',
        priceRange: '۱۵ تا ۵۰ میلیون تومان',
        minBudget: 15000000,
      },
      {
        id: 'premium',
        name: 'پکیج پریمیوم',
        products: ['سخت‌افزار اختصاصی', 'واقعیت مجازی (VR)', 'هوش مصنوعی پیشرفته', 'پشتیبانی ۲۴/۷ اختصاصی', 'خدمات حضوری'],
        advantage: 'لوکس‌ترین و پیشرفته‌ترین سطح خدمات برای خاص‌ترین مراجعین.',
        responseTime: 'آنی',
        priceRange: 'بیش از ۵۰ میلیون تومان',
        minBudget: 50000000,
      },
    ];
  }
};

export const calculateRecommendation = async (
  state: CalculatorState,
): Promise<RecommendationResult> => {
  const { budget, seats, waitTime, quality } = state;

  // Fetch packages from Strapi
  const packages = await fetchPackages();

  const find = (key: string): Package =>
    packages.find((p) => p.id === key) ?? packages[0];

  // Logic Checks
  if (budget < 500000) {
    return {
      recommendedPackage: null,
      error: 'بودجه انتخابی برای راه‌اندازی سیستم فانی‌ویت بسیار پایین است. لطفاً بودجه را افزایش دهید.',
    };
  }

  if (seats > 50 && budget < 5000000) {
    return {
      recommendedPackage: find('economic'),
      warning: 'تعداد صندلی بالا با این بودجه ممکن است باعث کاهش کیفیت تجربه کاربران شود. پیشنهاد می‌شود بودجه را افزایش دهید.',
    };
  }

  if (waitTime < 30 && quality !== 'premium' && quality !== 'professional') {
    return {
      recommendedPackage: find('professional'),
      suggestion: 'برای دستیابی به زمان انتظار بسیار کم، استفاده از پکیج‌های حرفه‌ای یا پریمیوم توصیه می‌شود تا زیرساخت لازم فراهم گردد.',
    };
  }

  // Selection Logic
  let recommended: Package;

  if (budget >= 50000000 || quality === 'premium') {
    recommended = find('premium');
  } else if (budget >= 15000000 || (seats > 100 && budget > 1000000)) {
    recommended = find('enterprise');
  } else if (budget >= 7000000 || quality === 'professional') {
    recommended = find('professional');
  } else if (budget >= 3000000 || quality === 'standard') {
    recommended = find('standard');
  } else {
    recommended = find('economic');
  }

  return { recommendedPackage: recommended };
};
