import type { Core } from '@strapi/strapi';

// ─── Seed data ────────────────────────────────────────────────────────────────

const GALLERY_ITEMS_FA = [
  { title: 'بازی تعاملی',      caption: 'مشتریان با سرگرمی‌های تعاملی وقت انتظار را فراموش می‌کنند', category: 'بازی و سرگرمی',  sort_order: 1 },
  { title: 'لبخند مشتریان',    caption: 'رضایت مشتریان ما را به پیش می‌برد',                           category: 'رضایت مشتری',   sort_order: 2 },
  { title: 'تعامل هدفمند',     caption: 'هر تعامل یک فرصت برای ایجاد ارزش',                           category: 'رضایت مشتری',   sort_order: 3 },
  { title: 'افزایش درآمد',     caption: 'رشد درآمد کسب‌وکار با مدیریت هوشمند انتظار',                 category: 'رشد کسب‌وکار',  sort_order: 4 },
  { title: 'مدیریت انتظار',    caption: 'سیستم نوبت‌دهی هوشمند برای صف‌های شلوغ',                    category: 'مدیریت',         sort_order: 5 },
  { title: 'رضایت مشتری',      caption: 'مشتریان راضی بازمی‌گردند و توصیه می‌کنند',                   category: 'رضایت مشتری',   sort_order: 6 },
  { title: 'رشد کسب‌وکار',     caption: 'فانی‌ویت موتور رشد کسب‌وکار شماست',                         category: 'رشد کسب‌وکار',  sort_order: 7 },
  { title: 'تجربه منحصربفرد',  caption: 'هر مشتری یک تجربه به یادماندنی می‌برد',                      category: 'بازی و سرگرمی',  sort_order: 8 },
];

const GALLERY_ITEMS_EN = [
  { title: 'Interactive Games',     caption: 'Customers forget waiting time with interactive entertainment', category: 'Games & Fun' },
  { title: 'Happy Customers',       caption: 'Customer satisfaction drives us forward',                      category: 'Satisfaction' },
  { title: 'Targeted Engagement',   caption: 'Every interaction is an opportunity to create value',          category: 'Satisfaction' },
  { title: 'Revenue Growth',        caption: 'Grow your business revenue with smart wait management',        category: 'Business Growth' },
  { title: 'Wait Management',       caption: 'Smart queue system for busy waiting rooms',                    category: 'Management' },
  { title: 'Customer Satisfaction', caption: 'Satisfied customers return and recommend',                     category: 'Satisfaction' },
  { title: 'Business Growth',       caption: 'FunnyWait is your business growth engine',                     category: 'Business Growth' },
  { title: 'Unique Experience',     caption: 'Every customer leaves with a memorable experience',            category: 'Games & Fun' },
];

// slug ← matches gallery-group.slug (localization-independent)
// category (fa) is used to link items → groups during seed
const GALLERY_GROUPS_FA = [
  { name: 'بازی و سرگرمی',  slug: 'games-fun',       sort_order: 1 },
  { name: 'رضایت مشتری',    slug: 'satisfaction',    sort_order: 2 },
  { name: 'رشد کسب‌وکار',   slug: 'business-growth', sort_order: 3 },
  { name: 'مدیریت',          slug: 'management',      sort_order: 4 },
];

const GALLERY_GROUPS_EN = [
  { name: 'Games & Fun'    },
  { name: 'Satisfaction'   },
  { name: 'Business Growth'},
  { name: 'Management'     },
];

// Persian category → group slug mapping (for seed linking)
const GALLERY_CATEGORY_TO_SLUG: Record<string, string> = {
  'بازی و سرگرمی':  'games-fun',
  'رضایت مشتری':    'satisfaction',
  'رشد کسب‌وکار':   'business-growth',
  'مدیریت':          'management',
};

const BUSINESS_PARTNERS_FA = [
  {
    name: 'محمد رستمی',
    company: 'شرکت فناوری اطلاعات البرز',
    location: 'تهران',
    since: '۱۴۰۰',
    achievements: 'همکاری طولانی مدت\nپروژه‌های موفق متعدد',
    description: 'همکاری بسیار موثر و حرفه‌ای. تیم پویا و دارای دانش فنی بالا.',
    sort_order: 1,
  },
  {
    name: 'نرگس حسنی',
    company: 'مؤسسه توسعه نرم‌افزار',
    location: 'اصفهان',
    since: '۱۴۰۱',
    achievements: 'راهکارهای نوآورانه\nپیاده‌سازی موفق پروژه‌ها',
    description: 'ارائه راهکارهای نوآورانه و پیاده‌سازی موفق پروژه‌ها.',
    sort_order: 2,
  },
  {
    name: 'رضا کمالی',
    company: 'شرکت دیجیتال پارس',
    location: 'مشهد',
    since: '۱۴۰۲',
    achievements: 'کیفیت بالا\nتعهد قوی',
    description: 'کیفیت بالا و تعهد قوی به تعهدات. همکاری بسیار رضایت‌بخش.',
    sort_order: 3,
  },
  {
    name: 'زهرا محمدی',
    company: 'گروه صنعتی نوآور',
    location: 'شیراز',
    since: '۱۴۰۳',
    achievements: 'ارتباطات خوب\nاجرای دقیق',
    description: 'ارتباطات بسیار خوب و اجرای دقیق پروژه‌ها در زمان مقرر.',
    sort_order: 4,
  },
];

const BUSINESS_PARTNERS_EN = [
  {
    name: 'Mohammad Rostami',
    company: 'Alborz IT Company',
    location: 'Tehran',
    achievements: 'Long-term partnership\nMultiple successful projects',
    description: 'Highly effective and professional collaboration. A dynamic team with strong technical expertise.',
  },
  {
    name: 'Narges Hasani',
    company: 'Software Development Institute',
    location: 'Isfahan',
    achievements: 'Innovative solutions\nSuccessful project delivery',
    description: 'Providing innovative solutions and successful project execution.',
  },
  {
    name: 'Reza Kamali',
    company: 'Digital Pars Company',
    location: 'Mashhad',
    achievements: 'High quality\nStrong commitment',
    description: 'High quality and strong commitment. A very satisfying partnership.',
  },
  {
    name: 'Zahra Mohammadi',
    company: 'Noavar Industrial Group',
    location: 'Shiraz',
    achievements: 'Great communication\nPrecise execution',
    description: 'Excellent communication and precise project delivery on time.',
  },
];

const SMART_PACKAGES_FA = [
  {
    package_key: 'economic' as const,
    name: 'پکیج اقتصادی',
    products: 'سیستم نوبت‌دهی پایه\n۳ بازی کلاسیک\nگزارش‌دهی ماهانه',
    advantage: 'بهترین گزینه برای شروع با کمترین هزینه و مدیریت اولیه مراجعین.',
    response_time: '۴۸ ساعت',
    price_range: '۱ تا ۳ میلیون تومان',
    min_budget: 1000000,
    sort_order: 1,
  },
  {
    package_key: 'standard' as const,
    name: 'پکیج استاندارد',
    products: 'سیستم نوبت‌دهی پیشرفته\n۱۰ بازی متنوع\nشخصی‌سازی محدود برند\nگزارش‌دهی هفتگی',
    advantage: 'تعادل عالی بین قیمت و امکانات برای کسب‌وکارهای در حال رشد.',
    response_time: '۲۴ ساعت',
    price_range: '۳ تا ۷ میلیون تومان',
    min_budget: 3000000,
    sort_order: 2,
  },
  {
    package_key: 'professional' as const,
    name: 'پکیج حرفه‌ای',
    products: 'سیستم مدیریت کامل\nتمامی بازی‌ها\nشخصی‌سازی کامل برند\nپشتیبانی اولویت‌دار\nتحلیل هوشمند رفتار',
    advantage: 'تجربه‌ای بی‌نظیر برای برندهای مطرح که به دنبال تمایز هستند.',
    response_time: '۱۲ ساعت',
    price_range: '۷ تا ۱۵ میلیون تومان',
    min_budget: 7000000,
    sort_order: 3,
  },
  {
    package_key: 'enterprise' as const,
    name: 'پکیج سازمانی',
    products: 'زیرساخت اختصاصی\nبازی‌های سفارشی\nاتصال به CRM\nمدیریت متمرکز شعب\nامنیت سطح بالا',
    advantage: 'راهکاری جامع و مقیاس‌پذیر برای مجموعه‌های بزرگ و زنجیره‌ای.',
    response_time: '۴ ساعت',
    price_range: '۱۵ تا ۵۰ میلیون تومان',
    min_budget: 15000000,
    sort_order: 4,
  },
  {
    package_key: 'premium' as const,
    name: 'پکیج پریمیوم',
    products: 'سخت‌افزار اختصاصی\nواقعیت مجازی (VR)\nهوش مصنوعی پیشرفته\nپشتیبانی ۲۴/۷ اختصاصی\nخدمات حضوری',
    advantage: 'لوکس‌ترین و پیشرفته‌ترین سطح خدمات برای خاص‌ترین مراجعین.',
    response_time: 'آنی',
    price_range: 'بیش از ۵۰ میلیون تومان',
    min_budget: 50000000,
    sort_order: 5,
  },
];

const SMART_PACKAGES_EN = [
  {
    name: 'Economic Package',
    products: 'Basic queue management\n3 classic games\nMonthly reporting',
    advantage: 'The best option to start with minimal cost and basic visitor management.',
    response_time: '48 hours',
    price_range: '1 to 3 million IRT',
  },
  {
    name: 'Standard Package',
    products: 'Advanced queue management\n10 varied games\nLimited brand customization\nWeekly reporting',
    advantage: 'Perfect balance between price and features for growing businesses.',
    response_time: '24 hours',
    price_range: '3 to 7 million IRT',
  },
  {
    name: 'Professional Package',
    products: 'Full management system\nAll games\nFull brand customization\nPriority support\nSmart behavior analytics',
    advantage: 'An exceptional experience for prominent brands seeking differentiation.',
    response_time: '12 hours',
    price_range: '7 to 15 million IRT',
  },
  {
    name: 'Enterprise Package',
    products: 'Dedicated infrastructure\nCustom games\nCRM integration\nCentralized branch management\nHigh-level security',
    advantage: 'A comprehensive and scalable solution for large chains and enterprises.',
    response_time: '4 hours',
    price_range: '15 to 50 million IRT',
  },
  {
    name: 'Premium Package',
    products: 'Dedicated hardware\nVirtual Reality (VR)\nAdvanced AI\nDedicated 24/7 support\nOn-site services',
    advantage: 'The most luxurious and advanced service level for the most exclusive clients.',
    response_time: 'Instant',
    price_range: 'Over 50 million IRT',
  },
];

const FEATURES_CONFIG_FA = {
  section_title: 'چرا فانی‌ویت؟',
  section_subtitle: 'ویژگی‌هایی که ما را متمایز می‌کنند',
};

const FEATURES_CONFIG_EN = {
  section_title: 'Why FunnyWait?',
  section_subtitle: 'Features that set us apart',
};

const FEATURE_CARDS_FA = [
  {
    title: 'چگونه سرعت عمل بالا را تضمین می‌کنید؟',
    description: 'با استفاده از CDNهای پیشرفته و بهینه‌سازی‌های فنی',
    content_title: 'سرعت عمل بالا',
    content_description:
      'ما با استفاده از شبکه‌های توزیع محتوا (CDN) و بهینه‌سازی‌های فنی، سرعت عمل بالایی را برای کاربران فراهم می‌کنیم. این شامل کش‌کردن اطلاعات، کاهش زمان بارگذاری و بهینه‌سازی کدها می‌شود.',
    sort_order: 1,
  },
  {
    title: 'چگونه امنیت داده‌ها را تضمین می‌کنید؟',
    description: 'با رمزگذاری پیشرفته و مدیریت دسترسی',
    content_title: 'امنیت داده‌ها',
    content_description:
      'حفاظت از داده‌های کاربران اولویت اصلی ما است. ما از روش‌های رمزگذاری پیشرفته، مدیریت دسترسی مبتنی بر نقش (RBAC) و پروتکل‌های امنیتی صنعتی برای تضمین امنیت کامل استفاده می‌کنیم.',
    sort_order: 2,
  },
  {
    title: 'چگونه مقیاس‌پذیری سیستم را ارائه می‌دهید؟',
    description: 'با معماری میکروسرویس و ابر محور',
    content_title: 'مقیاس‌پذیری',
    content_description:
      'سیستم ما بر پایه معماری میکروسرویس و ابر محور طراحی شده است که امکان مقیاس‌پذیری افقی و عمودی را فراهم می‌کند. این امر باعث می‌شود بدون توقف سرویس، قابلیت گسترش به راحتی انجام شود.',
    sort_order: 3,
  },
  {
    title: 'چگونه با سیستم‌های دیگر یکپارچه می‌شوید؟',
    description: 'با APIهای RESTful و WebSocket',
    content_title: 'یکپارچه‌سازی',
    content_description:
      'ما از APIهای RESTful و WebSocket برای یکپارچه‌سازی با سیستم‌های مختلف استفاده می‌کنیم. این امکان را فراهم می‌کند تا سیستم‌های موجود به راحتی با خدمات ما ارتباط برقرار کنند.',
    sort_order: 4,
  },
];

const FEATURE_CARDS_EN = [
  {
    title: 'How do you guarantee high performance?',
    description: 'Using advanced CDNs and technical optimizations',
    content_title: 'High Performance',
    content_description:
      'We provide high performance for users through content delivery networks (CDN) and technical optimizations, including data caching, reduced load times, and code optimization.',
  },
  {
    title: 'How do you ensure data security?',
    description: 'With advanced encryption and access management',
    content_title: 'Data Security',
    content_description:
      'Protecting user data is our top priority. We use advanced encryption methods, role-based access control (RBAC), and industry-standard security protocols to ensure complete security.',
  },
  {
    title: 'How do you provide system scalability?',
    description: 'With microservice and cloud-native architecture',
    content_title: 'Scalability',
    content_description:
      'Our system is built on microservice and cloud-native architecture, enabling horizontal and vertical scalability. This allows seamless expansion without service interruptions.',
  },
  {
    title: 'How do you integrate with other systems?',
    description: 'With RESTful APIs and WebSocket',
    content_title: 'Integration',
    content_description:
      'We use RESTful APIs and WebSocket for integration with various systems, making it easy for existing systems to connect and communicate with our services.',
  },
];

// ─── Testimonials (نظرات مشتریان) ─────────────────────────────────────────────

const TESTIMONIALS_FA = [
  {
    author_name: 'علی محمدی',
    company: 'آرایشگاه لوکس تهران',
    position: 'مالک',
    comment: 'فانی‌ویت کاملاً تجربه انتظار مشتریان را تغییر داده است. میزان شکایت‌ها به شدت کاهش یافته و رضایت مشتریان به طور قابل‌توجهی افزایش پیدا کرده است. سیستم استفاده آن بسیار آسان و پشتیبانی تیم بسیار عالی است.',
    rating: 5,
    featured: true,
    sort_order: 1,
  },
  {
    author_name: 'فاطمه رضایی',
    company: 'کلینیک دندانپزشکی سبز',
    position: 'مدیر عملیات',
    comment: 'بیماران ما اکنون انتظار را کمتر احساس می‌کنند. بازی‌ها و محتوای آموزشی واقعاً مؤثر است. آمار‌های ماهانه نیز بسیار کمک‌کننده برای بهبود خدمات است.',
    rating: 5,
    featured: true,
    sort_order: 2,
  },
  {
    author_name: 'محمد حسن‌زاده',
    company: 'رستوران پاسیون',
    position: 'مدیر',
    comment: 'از آن زمان که فانی‌ویت را نصب کردیم، انتظار مشتریان برای نوبت چندان خسته‌کننده نیست. بعضی‌ها حتی بلند شده و بیشتر وقت سپری کردند. این سرمایه‌گذاری واقعاً بازگشت داشتند.',
    rating: 5,
    featured: true,
    sort_order: 3,
  },
  {
    author_name: 'نازنین کریمی',
    company: 'بانک تجاری',
    position: 'رئیس امور مشتریان',
    comment: 'استفاده از فانی‌ویت توانایی ما را برای مدیریت صف‌های شلوغ بهبود داد. مشتریان شاکی‌تر هستند و امتیاز رضایتمندی ما به شدت افزایش یافته است.',
    rating: 4,
    featured: false,
    sort_order: 4,
  },
  {
    author_name: 'سعید مرادی',
    company: 'بیمارستان شهید بهشتی',
    position: 'مدیر بخش انتظار',
    comment: 'یکی از بهترین تصمیم‌های مدیریتی ما بود. انتظار در بیمارستان همیشه بخش حساسی است، اما الآن مریضان و همراهانشان بیشتر آرام هستند.',
    rating: 5,
    featured: false,
    sort_order: 5,
  },
];

const TESTIMONIALS_EN = [
  {
    author_name: 'Ali Mohammadi',
    company: 'Luxury Salon Tehran',
    position: 'Owner',
    comment: 'FunnyWait has completely transformed the customer waiting experience. Complaints have dropped significantly and customer satisfaction has increased noticeably. The system is very easy to use and the team support is excellent.',
    rating: 5,
    featured: true,
    sort_order: 1,
  },
  {
    author_name: 'Fateme Rezaei',
    company: 'Green Dental Clinic',
    position: 'Operations Manager',
    comment: 'Our patients now feel the wait less. The games and educational content are truly effective. Monthly statistics also help us improve our services.',
    rating: 5,
    featured: true,
    sort_order: 2,
  },
  {
    author_name: 'Mohammad Hasanzadeh',
    company: 'Passion Restaurant',
    position: 'Manager',
    comment: 'Since installing FunnyWait, customers don\'t find waiting for their turn as tedious. Some even spent more time enjoying it. This investment truly paid off.',
    rating: 5,
    featured: true,
    sort_order: 3,
  },
  {
    author_name: 'Nazanin Karimi',
    company: 'Commercial Bank',
    position: 'Customer Affairs Manager',
    comment: 'Using FunnyWait improved our ability to manage busy queues. Customers are happier and our satisfaction scores have increased significantly.',
    rating: 4,
    featured: false,
    sort_order: 4,
  },
  {
    author_name: 'Saeed Moradi',
    company: 'Shahid Beheshti Hospital',
    position: 'Wait Management Director',
    comment: 'One of the best management decisions we made. Waiting at the hospital is always a sensitive area, but now patients and their companions are much more at ease.',
    rating: 5,
    featured: false,
    sort_order: 5,
  },
];

const HERO_FA = {
  badge: 'آینده مدیریت زمان انتظار اینجاست',
  heading: 'فانی‌ویت',
  subtitle:
    'تبدیل زمان کسل‌کننده انتظار به تجربه‌ای سرگرم‌کننده و درآمدزا برای کسب‌وکار شما.',
  subtitle_highlight_1: 'سرگرم‌کننده',
  subtitle_highlight_2: 'درآمدزا',
  cta_text: 'معرفی فانی ویت',
  scroll_hint: 'اسکرول کنید',
  // non-localized fields (animation / 3-D config — same for all locales)
  scroll_fade_start: 0,
  scroll_fade_end: 0.08,
  scroll_scale_end: 0.85,
  scroll_y_end: -60,
  morph_1_threshold: 0.15,
  morph_2_threshold: 0.45,
  morph_3_threshold: 0.75,
};

const HERO_EN = {
  badge: 'The future of wait-time management is here',
  heading: 'FunnyWait',
  subtitle:
    'Transform boring wait time into an entertaining and profitable experience for your business.',
  subtitle_highlight_1: 'entertaining',
  subtitle_highlight_2: 'profitable',
  cta_text: 'Discover FunnyWait',
  scroll_hint: 'Scroll',
};

const CALC_FA = {
  default_visitors: 50,
  default_wait_time: 20,
  default_participation: 40,
  default_engagement: 10,
  default_attention_value: 500,
  default_conversion: 5,
  default_profit: 50000,
  subscription_cost: 1500000,
  high_profit_msg: 'سرمایه‌گذاری کاملاً توجیه‌پذیر است',
  mid_profit_msg: 'پتانسیل رشد بالا با بهینه‌سازی مشارکت',
  low_profit_msg: 'نیاز به افزایش تعامل کاربران',
};

const CALC_EN = {
  high_profit_msg: 'Investment is fully justified',
  mid_profit_msg: 'High growth potential with participation optimization',
  low_profit_msg: 'User engagement needs improvement',
};

const PRODUCTS_FA = [
  {
    title: 'پکیج پایه فانی‌ویت',
    description: 'مناسب برای کسب‌وکارهای کوچک و نوپا با حجم مراجعین متوسط.',
    features: 'مدیریت صف پایه، ۳ بازی انتخابی، گزارش ماهانه',
    price: '۹۵۰,۰۰۰ تومان / ماه',
    shop_url: 'https://shop.funnywait.ir/basic',
    long_description: '## پکیج پایه فانی‌ویت\n\nاین پکیج مناسب کسب‌وکارهای کوچک و نوپاست که می‌خواهند با کمترین هزینه، تجربه انتظار مشتریان خود را بهبود دهند.\n\n### امکانات\n- **مدیریت صف پایه**: سیستم نوبت‌دهی ساده و کاربرپسند\n- **۳ بازی کلاسیک انتخابی**: سرگرمی‌های متنوع برای کاهش حس انتظار\n- **گزارش‌دهی ماهانه**: آمار کلی عملکرد سیستم\n- **پشتیبانی ایمیلی**: پاسخگویی در ساعات اداری\n\n### مزایا\nبا هزینه بسیار مناسب، اولین قدم را به سمت مدیریت هوشمند زمان انتظار بردارید.',
  },
  {
    title: 'پکیج حرفه‌ای فانی‌ویت',
    description: 'راهکار کامل برای آرایشگاه‌ها و مراکز خدماتی پرتردد.',
    features: 'تمامی بازی‌ها، شخصی‌سازی برند، پنل مدیریت پیشرفته، پشتیبانی VIP',
    price: '۲,۴۰۰,۰۰۰ تومان / ماه',
    shop_url: 'https://shop.funnywait.ir/pro',
    long_description: '## پکیج حرفه‌ای فانی‌ویت\n\nراهکاری جامع و حرفه‌ای برای مراکز خدماتی پرتردد که به دنبال تجربه‌ای متمایز هستند.\n\n### امکانات\n- **تمامی بازی‌های موجود**: دسترسی نامحدود به کتابخانه بازی‌ها\n- **شخصی‌سازی کامل برند**: لوگو، رنگ‌ها و محتوای اختصاصی\n- **پنل مدیریت پیشرفته**: کنترل کامل بر تمام جنبه‌های سیستم\n- **پشتیبانی VIP**: پاسخگویی سریع و اختصاصی\n- **تحلیل رفتار مشتریان**: بینش عمیق از الگوهای رفتاری\n\n### مزایا\nبرند خود را متمایز کنید و تجربه‌ای فراموش‌نشدنی برای مشتریانتان بسازید.',
  },
  {
    title: 'پکیج مراکز درمانی',
    description: 'بهینه‌سازی شده برای کلینیک‌ها و مطب‌های پزشکی جهت کاهش استرس انتظار.',
    features: 'محتوای آموزشی تعاملی، سیستم نوبت‌دهی هوشمند، بازی‌های آرامش‌بخش',
    price: '۳,۸۰۰,۰۰۰ تومان / ماه',
    shop_url: 'https://shop.funnywait.ir/medical',
    long_description: '## پکیج مراکز درمانی\n\nاین پکیج به‌طور ویژه برای محیط‌های بهداشتی و درمانی طراحی شده است.\n\n### امکانات\n- **محتوای آموزشی تعاملی**: اطلاعات سلامت و بهداشت به صورت جذاب\n- **سیستم نوبت‌دهی هوشمند**: مدیریت دقیق نوبت‌ها و زمان انتظار\n- **بازی‌های آرامش‌بخش**: کاهش اضطراب و استرس بیماران\n- **اطلاع‌رسانی خودکار**: پیامک و نوتیفیکیشن برای بیماران\n\n### مزایا\nمحیط انتظار کلینیک خود را به فضایی آرام و آموزنده تبدیل کنید.',
  },
];

const PRODUCTS_EN = [
  {
    title: 'FunnyWait Basic Package',
    description: 'Ideal for small and emerging businesses with moderate visitor volume.',
    features: 'Basic queue management, 3 selected games, monthly report',
    price: '950,000 IRT / month',
    long_description: '## FunnyWait Basic Package\n\nPerfect for small businesses getting started with smart wait management.\n\n### Features\n- **Basic queue management**: Simple and user-friendly queuing system\n- **3 classic games**: Fun entertainment to reduce perceived wait time\n- **Monthly reporting**: Overview of system performance\n- **Email support**: Business hours response\n\n### Benefits\nTake the first step toward smart wait-time management at minimal cost.',
  },
  {
    title: 'FunnyWait Professional Package',
    description: 'Complete solution for busy salons and high-traffic service centers.',
    features: 'All games, brand customization, advanced management panel, VIP support',
    price: '2,400,000 IRT / month',
    long_description: '## FunnyWait Professional Package\n\nA comprehensive solution for high-traffic service centers seeking distinction.\n\n### Features\n- **All available games**: Unlimited access to the game library\n- **Full brand customization**: Logo, colors, and custom content\n- **Advanced management panel**: Complete control over all system aspects\n- **VIP support**: Fast and dedicated response\n- **Customer behavior analytics**: Deep insights into behavioral patterns\n\n### Benefits\nDifferentiate your brand and build an unforgettable experience for your customers.',
  },
  {
    title: 'Medical Centers Package',
    description: 'Optimized for clinics and medical offices to reduce waiting-room stress.',
    features: 'Interactive educational content, smart appointment system, relaxing games',
    price: '3,800,000 IRT / month',
    long_description: '## Medical Centers Package\n\nSpecially designed for healthcare environments.\n\n### Features\n- **Interactive health education**: Engaging health and wellness information\n- **Smart appointment system**: Precise appointment and wait-time management\n- **Relaxing games**: Reduce patient anxiety and stress\n- **Automatic notifications**: SMS and push notifications for patients\n\n### Benefits\nTransform your clinic waiting room into a calm and educational space.',
  },
];

// ─── Content Manager field label metadata (فارسی) ─────────────────────────────
// این ثابت‌ها label و description هر فیلد را در فرم ویرایش ادمین تعیین می‌کنند.

type FieldMeta = { label: string; description: string; sortable?: boolean };

const HERO_FIELD_META: Record<string, FieldMeta> = {
  badge:                { label: 'نشان‌واره',          description: 'متن نشان‌واره کوچک بالای تیتر اصلی' },
  heading:              { label: 'تیتر اصلی',           description: 'عنوان بزرگ صفحه — معمولاً نام محصول' },
  subtitle:             { label: 'زیرنویس',             description: 'توضیح کوتاه زیر تیتر — شامل دو کلمه هایلایت' },
  subtitle_highlight_1: { label: 'هایلایت اول',         description: 'کلمه برجسته اول که باید عیناً در subtitle باشد' },
  subtitle_highlight_2: { label: 'هایلایت دوم',         description: 'کلمه برجسته دوم که باید عیناً در subtitle باشد' },
  cta_text:             { label: 'متن دکمه اقدام',      description: 'متن دکمه Call-to-Action' },
  scroll_hint:          { label: 'راهنمای اسکرول',      description: 'متن پایین صفحه — دعوت به پایین‌کشیدن' },
  scroll_fade_start:    { label: 'شروع محو اسکرول',     description: 'درصد اسکرول شروع fade — بین ۰ و ۱' },
  scroll_fade_end:      { label: 'پایان محو اسکرول',    description: 'درصد اسکرول پایان fade — بین ۰ و ۱' },
  scroll_scale_end:     { label: 'مقیاس پایانی',        description: 'نسبت کوچک‌شدن هیرو — مثلاً ۰.۸۵' },
  scroll_y_end:         { label: 'جابجایی عمودی (px)',  description: 'حرکت عمودی هیرو به پیکسل — منفی = بالا' },
  morph_1_threshold:    { label: 'آستانه تبدیل ۱',     description: 'درصد اسکرول تبدیل مکعب → کارت' },
  morph_2_threshold:    { label: 'آستانه تبدیل ۲',     description: 'درصد اسکرول تبدیل کارت → تانگو' },
  morph_3_threshold:    { label: 'آستانه تبدیل ۳',     description: 'درصد اسکرول کامل‌شدن تبدیل نهایی' },
};

const CALC_FIELD_META: Record<string, FieldMeta> = {
  default_visitors:       { label: 'بازدیدکنندگان روزانه (پیش‌فرض)',     description: 'تعداد مشتریان ورودی در روز', sortable: true },
  default_wait_time:      { label: 'زمان انتظار — دقیقه (پیش‌فرض)',     description: 'میانگین دقیقه انتظار هر مشتری', sortable: true },
  default_participation:  { label: 'نرخ مشارکت — % (پیش‌فرض)',          description: 'درصد بازدیدکنندگانی که با FunnyWait تعامل می‌کنند', sortable: true },
  default_engagement:     { label: 'زمان تعامل — دقیقه (پیش‌فرض)',      description: 'میانگین دقیقه تعامل هر کاربر با محتوا', sortable: true },
  default_attention_value:{ label: 'ارزش توجه — تومان (پیش‌فرض)',       description: 'ارزش ریالی هر دقیقه توجه کامل مشتری', sortable: true },
  default_conversion:     { label: 'نرخ تبدیل — % (پیش‌فرض)',           description: 'درصد کاربرانی که پس از تعامل خرید می‌کنند', sortable: true },
  default_profit:         { label: 'سود هر فروش — تومان (پیش‌فرض)',     description: 'میانگین سود خالص هر تراکنش', sortable: true },
  subscription_cost:      { label: 'هزینه اشتراک ماهانه — تومان',       description: 'مبلغ ماهانه FunnyWait که از سود کسر می‌شود', sortable: true },
  high_profit_msg:        { label: 'پیام سود بالا',                      description: 'پیام نمایشی وقتی ROI بالا است' },
  mid_profit_msg:         { label: 'پیام سود متوسط',                     description: 'پیام نمایشی وقتی ROI متوسط است' },
  low_profit_msg:         { label: 'پیام سود پایین',                     description: 'پیام نمایشی وقتی ROI پایین یا منفی است' },
};

const FEATURES_CONFIG_FIELD_META: Record<string, FieldMeta> = {
  section_title:    { label: 'عنوان بخش',     description: 'عنوان اصلی بخش «چرا فانی‌ویت؟»' },
  section_subtitle: { label: 'زیرعنوان بخش',  description: 'جمله توضیحی زیر عنوان' },
};

const FEATURE_CARD_FIELD_META: Record<string, FieldMeta> = {
  title:               { label: 'عنوان / سوال',         description: 'متن کارت در ستون چپ', sortable: true },
  description:         { label: 'توضیح کوتاه',           description: 'یک جمله خلاصه زیر عنوان' },
  content_title:       { label: 'عنوان پنل جزئیات',     description: 'تیتر ستون راست هنگام انتخاب کارت' },
  content_description: { label: 'متن پنل جزئیات',       description: 'توضیح کامل در ستون راست' },
  media:               { label: 'تصویر یا ویدیو',        description: 'از Media Center آپلود کنید — JPG، PNG، WebP، MP4' },
  sort_order:          { label: 'ترتیب نمایش',           description: 'عدد کمتر = نمایش اول', sortable: true },
};

const SMART_PACKAGE_FIELD_META: Record<string, FieldMeta> = {
  package_key:   { label: 'کلید پکیج',              description: 'شناسه یکتای پکیج — تغییر ندهید (economic/standard/professional/enterprise/premium)', sortable: true },
  name:          { label: 'نام پکیج',               description: 'نام نمایشی پکیج در نتیجه ماشین‌حساب هوشمند', sortable: true },
  products:      { label: 'ویژگی‌ها (هر خط یک آیتم)', description: 'هر ویژگی را در یک خط جداگانه بنویسید — هر خط به صورت یک آیتم در لیست نمایش داده می‌شود' },
  advantage:     { label: 'مزیت اصلی',              description: 'چند جمله که دلیل انتخاب این پکیج را توضیح می‌دهد' },
  response_time: { label: 'زمان پاسخ پشتیبانی',     description: 'مثال: ۲۴ ساعت یا آنی' },
  price_range:   { label: 'بازه قیمت',              description: 'مثال: ۳ تا ۷ میلیون تومان', sortable: true },
  min_budget:    { label: 'حداقل بودجه (تومان)',     description: 'عدد به تومان — برای منطق پیشنهاددهی استفاده می‌شود', sortable: true },
  sort_order:    { label: 'ترتیب نمایش',             description: 'عدد کمتر = نمایش زودتر', sortable: true },
};

const CUSTOMER_FIELD_META: Record<string, FieldMeta> = {
  name:             { label: 'نام مشتری',                   description: 'نام کامل مشتری یا شرکت — نمایش‌داده‌شده روی کارت و مدال', sortable: true },
  logo_text:        { label: 'حروف اختصاری لوگو',           description: 'حداکثر ۳ حرف — مثلاً «PF» یا «SA». مشترک بین زبان‌ها.' },
  description:      { label: 'توضیح کوتاه',                 description: 'یک جمله زیر نام در کارت' },
  website:          { label: 'آدرس وب‌سایت',                description: 'URL وب‌سایت مشتری — مشترک بین زبان‌ها' },
  industry:         { label: 'صنعت / حوزه فعالیت',          description: 'نمایش‌داده‌شده در تب «اطلاعات کسب‌وکار»', sortable: true },
  employees:        { label: 'تعداد کارمندان',               description: 'عدد صحیح — مشترک بین زبان‌ها', sortable: true },
  revenue:          { label: 'درآمد سالانه',                 description: 'متن آزاد — مثلاً «۵ میلیارد تومان»' },
  founded:          { label: 'سال تأسیس',                   description: 'مثلاً ۱۳۹۷ یا 2018 — مشترک بین زبان‌ها', sortable: true },
  street:           { label: 'آدرس خیابان',                 description: 'نمایش‌داده‌شده در تب «آدرس و نقشه»' },
  city:             { label: 'شهر',                          description: 'نام شهر', sortable: true },
  country:          { label: 'کشور',                         description: 'نام کشور', sortable: true },
  phone:            { label: 'شماره تماس',                  description: 'مثلاً +98 21 1234 5678 — مشترک بین زبان‌ها' },
  email:            { label: 'ایمیل تماس',                  description: 'آدرس ایمیل — مشترک بین زبان‌ها' },
  gallery:          { label: 'گالری تصاویر',                 description: 'تصاویر نمایشی در تب «گالری» — JPG، PNG، WebP. مشترک بین زبان‌ها.' },
  partnership_date: { label: 'تاریخ آغاز همکاری',           description: 'تاریخ شروع همکاری با فانی‌ویت — مشترک بین زبان‌ها' },
  sort_order:       { label: 'ترتیب نمایش',                  description: 'عدد کمتر = نمایش زودتر', sortable: true },
};

const GALLERY_GROUP_FIELD_META: Record<string, FieldMeta> = {
  name:       { label: 'نام گروه',      description: 'نام نمایشی گروه در تب‌های فیلتر بالای گالری. برای هر زبان جداگانه تنظیم کنید.', sortable: true },
  slug:       { label: 'شناسه (slug)',   description: 'شناسه یکتا به لاتین — برای فیلتر فرانت‌اند. مثال: games-fun. مشترک بین زبان‌ها.', sortable: true },
  sort_order: { label: 'ترتیب نمایش',  description: 'عدد کمتر = نمایش زودتر در تب‌ها. مشترک بین زبان‌ها.', sortable: true },
};

const BUSINESS_PARTNER_FIELD_META: Record<string, FieldMeta> = {
  name:         { label: 'نام',               description: 'نام نمایشی همکار — شخص یا نام تجاری کوتاه', sortable: true },
  company:      { label: 'نام شرکت',          description: 'نام کامل شرکت یا سازمان همکار', sortable: true },
  location:     { label: 'شهر',               description: 'شهر یا منطقه جغرافیایی — مثلاً تهران', sortable: true },
  since:        { label: 'سال شروع همکاری',   description: 'سال شروع همکاری — مشترک بین زبان‌ها', sortable: true },
  achievements: { label: 'دستاوردها (هر خط یک آیتم)', description: 'هر دستاورد را در یک خط بنویسید — هر خط به صورت یک badge نمایش داده می‌شود' },
  description:  { label: 'توضیح',             description: 'توضیح کوتاه از این همکاری و ویژگی‌های مثبت همکار' },
  logo:         { label: 'لوگو',              description: 'لوگوی شرکت همکار — JPG، PNG، WebP، SVG. مشترک بین زبان‌ها' },
  sort_order:   { label: 'ترتیب نمایش',       description: 'عدد کمتر = نمایش زودتر', sortable: true },
};

const PRODUCT_FIELD_META: Record<string, FieldMeta> = {
  title:            { label: 'عنوان محصول',                  description: 'نام پکیج — نمایش‌داده‌شده در کارت محصول', sortable: true },
  description:      { label: 'توضیحات',                      description: 'شرح کوتاه از پکیج و مخاطب هدف' },
  features:         { label: 'ویژگی‌ها (با ویرگول جدا شود)',  description: 'لیست امکانات — هر آیتم در سایت با تیک نمایش داده می‌شود' },
  price:            { label: 'قیمت',                          description: 'قیمت متنی — مثلاً ۹۵۰,۰۰۰ تومان / ماه', sortable: true },
  shop_url:         { label: 'لینک خرید',                    description: 'URL صفحه خرید در سایت فروشگاه' },
  image:            { label: 'تصویر محصول',                  description: 'تصویر نمایشی کارت محصول (JPG/PNG/WebP)' },
  long_description: { label: 'توضیحات بلند (Markdown)',      description: 'متن ساختاریافته بلند — در مودال شیشه‌ای نمایش داده می‌شود. از تیتر (#)، لیست (-)، بولد (**) استفاده کنید' },
};

const SERVICE_FIELD_META: Record<string, FieldMeta> = {
  title:       { label: 'عنوان خدمات',     description: 'نام خدمات — عنوانی واضح و جذاب که توجه جلب کند', sortable: true },
  description: { label: 'توضیح کوتاه',     description: 'یک یا دو جمله که مخاطب هدف و مزیت اصلی خدمات را بیان می‌کند' },
  features:    { label: 'امکانات (با ویرگول جدا)', description: 'لیست امکانات و ویژگی‌های خدمات — هر آیتم در سایت جداگانه نمایش داده می‌شود' },
  icon:        { label: 'آیکون',           description: 'نوع آیکونی: Code، Wrench، Server، Smartphone، Package، Star. مشترک بین زبان‌ها.', sortable: true },
};

const TESTIMONIAL_FIELD_META: Record<string, FieldMeta> = {
  author_name: { label: 'نام مشتری',                     description: 'نام کامل یا نام تجاری فردی که نظر ارائه داده است. روی کارت نمایش داده می‌شود.', sortable: true },
  company:     { label: 'نام شرکت/سازمان',               description: 'نام شرکت یا سازمان متعلق مشتری — نمایش‌داده‌شده زیر نام در کارت نظر.', sortable: true },
  position:    { label: 'سمت یا عنوان شغلی',             description: 'سمت یا عنوان شغلی مشتری در شرکت — مثلاً مدیر بازاریابی یا مالک.' },
  comment:     { label: 'متن نظر',                        description: 'متن نظر و تجربه مشتری — توضیح کامل درباره تجربه استفاده از FunnyWait.' },
  rating:      { label: 'امتیاز (۱-۵)',                   description: 'امتیاز ستاره‌ای از ۱ تا ۵ — برای نمایش ستاره‌های طلایی استفاده می‌شود.', sortable: true },
  featured:    { label: 'نمایش در صفحه اصلی؟',            description: 'اگر فعال باشد، در بخش «نظرات برتر» صفحه اصلی نمایش داده می‌شود.' },
  avatar:      { label: 'تصویر/آواتار',                   description: 'تصویر یا آواتار مشتری — عکسی کوچک که روی کارت نمایش داده می‌شود (JPG، PNG، WebP). ابعاد: ۱۲۰×۱۲۰ پیکسل.' },
  sort_order:  { label: 'ترتیب نمایش',                   description: 'عدد کمتر = نمایش زودتر. برای تعیین موقعیت نظر در لیست استفاده می‌شود.', sortable: true },
};

// ─── Services (خدمات) ────────────────────────────────────────────────────────

const SERVICES_FA = [
  {
    title: 'سیستم مدیریت صف هوشمند',
    description: 'سیستم نوبت‌دهی هوشمند که مدیریت صف‌های شلوغ را ساده می‌کند و تجربه مشتری را بهبود می‌بخشد.',
    features: 'نوبت‌دهی خودکار، ردیابی صف بلادرنگ، اطلاع‌رسانی خودکار، یکپارچگی سیستم‌های پذیرش',
    icon: 'Code' as const,
  },
  {
    title: 'بازی‌های تعاملی و سرگرمی',
    description: 'مجموعه بازی‌های متنوع و سرگرم‌کننده برای کاهش احساس انتظار مشتریان.',
    features: 'بازی‌های کلاسیک، بازی‌های آموزشی، بازی‌های سفارشی، گیم‌ها برای تمام سنین',
    icon: 'Package' as const,
  },
  {
    title: 'پنل مدیریت پیشرفته',
    description: 'داشبورد جامع برای کنترل کامل سیستم و نمایش آمار بلادرنگ.',
    features: 'داشبورد تحلیلی، گزارش‌های دقیق، مدیریت محتوا، کنترل سطح دسترسی',
    icon: 'Server' as const,
  },
  {
    title: 'شخصی‌سازی برند',
    description: 'تطابق کامل سیستم با هویت بصری برند شما.',
    features: 'لوگو و رنگ‌های اختصاصی، پوسترهای سفارشی، متن و پیام‌های شرکتی، تم‌های مختلف',
    icon: 'Smartphone' as const,
  },
  {
    title: 'تحلیل رفتار مشتری',
    description: 'درک عمیق از رفتار و ترجیحات مشتریان برای بهینه‌سازی خدمات.',
    features: 'آمار بازدید، تحلیل بازی‌های محبوب، زمان تعامل، نرخ رضایت مشتری',
    icon: 'Wrench' as const,
  },
  {
    title: 'پشتیبانی ۲۴/۷',
    description: 'تیم پشتیبانی مجرب همیشه آماده کمک و حل مشکلات.',
    features: 'پاسخگویی سریع، پشتیبانی تلفنی و ایمیلی، راهنمایی فنی، آپدیت رایگان',
    icon: 'Star' as const,
  },
];

const SERVICES_EN = [
  {
    title: 'Smart Queue Management System',
    description: 'Intelligent appointment system that simplifies managing busy queues and improves customer experience.',
    features: 'Automatic appointment scheduling, Real-time queue tracking, Automatic notifications, POS system integration',
    icon: 'Code' as const,
  },
  {
    title: 'Interactive Games & Entertainment',
    description: 'A variety of engaging games and entertainment to reduce customer perception of wait time.',
    features: 'Classic games, Educational games, Custom games, Games for all ages',
    icon: 'Package' as const,
  },
  {
    title: 'Advanced Management Panel',
    description: 'Comprehensive dashboard for complete system control and real-time analytics display.',
    features: 'Analytical dashboard, Detailed reports, Content management, Access level control',
    icon: 'Server' as const,
  },
  {
    title: 'Brand Customization',
    description: 'Full system alignment with your brand visual identity.',
    features: 'Custom logo and colors, Custom posters, Company messages and text, Various themes',
    icon: 'Smartphone' as const,
  },
  {
    title: 'Customer Behavior Analytics',
    description: 'Deep understanding of customer behavior and preferences to optimize your services.',
    features: 'Visit statistics, Popular games analysis, Engagement time, Customer satisfaction rate',
    icon: 'Wrench' as const,
  },
  {
    title: '24/7 Support',
    description: 'Experienced support team always ready to help and resolve issues.',
    features: 'Fast response, Phone and email support, Technical guidance, Free updates',
    icon: 'Star' as const,
  },
];

// ─── Helpers (باید قبل از export default تعریف شوند) ─────────────────────────

async function seedCustomers(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::customer.customer').count({ locale: 'fa' });

    if (count === 0) {
      const CUSTOMERS_FA = [
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
          phone: '+98 51 111 2222',
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
          phone: '+98 71 33 4444',
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
          phone: '+98 41 5555 6666',
          email: 'contact@modern-tech.ir',
          partnership_date: '2022-01-05',
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

      const CUSTOMERS_EN = [
        {
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
        },
        {
          name: 'Software Solutions Co.',
          logo_text: 'SS',
          description: 'Software solutions and consulting',
          website: 'https://softwarecompany.ir',
          industry: 'Software',
          employees: 75,
          revenue: '$3M',
          founded: '2020',
          street: '456 Software Ave',
          city: 'Isfahan',
          country: 'Iran',
          phone: '+98 31 8765 4321',
          email: 'info@softwarecompany.ir',
          partnership_date: '2022-08-20',
          sort_order: 2,
        },
        {
          name: 'AI Startup Inc.',
          logo_text: 'AI',
          description: 'Artificial intelligence projects',
          website: 'https://aistartup.ir',
          industry: 'AI/ML',
          employees: 25,
          revenue: '$1M',
          founded: '2021',
          street: '789 AI Boulevard',
          city: 'Mashhad',
          country: 'Iran',
          phone: '+98 51 111 2222',
          email: 'hello@aistartup.ir',
          partnership_date: '2023-03-10',
          sort_order: 3,
        },
        {
          name: 'Digital Innovation Co.',
          logo_text: 'DI',
          description: 'Digital transformation solutions',
          website: 'https://digitalcompany.ir',
          industry: 'Digital Services',
          employees: 50,
          revenue: '$2M',
          founded: '2019',
          street: '321 Digital Road',
          city: 'Shiraz',
          country: 'Iran',
          phone: '+98 71 33 4444',
          email: 'support@digitalcompany.ir',
          partnership_date: '2023-06-01',
          sort_order: 4,
        },
        {
          name: 'Modern Technology Group',
          logo_text: 'MT',
          description: 'Cutting-edge technology solutions',
          website: 'https://modern-tech.ir',
          industry: 'Innovation',
          employees: 120,
          revenue: '$8M',
          founded: '2017',
          street: '555 Innovation St',
          city: 'Tabriz',
          country: 'Iran',
          phone: '+98 41 5555 6666',
          email: 'contact@modern-tech.ir',
          partnership_date: '2022-11-05',
          sort_order: 5,
        },
        {
          name: 'Cloud Solutions Co.',
          logo_text: 'CS',
          description: 'Cloud computing services',
          website: 'https://cloudcompany.ir',
          industry: 'Cloud Services',
          employees: 80,
          revenue: '$4M',
          founded: '2020',
          street: '777 Cloud Avenue',
          city: 'Qom',
          country: 'Iran',
          phone: '+98 25 777 8888',
          email: 'info@cloudcompany.ir',
          partnership_date: '2023-02-14',
          sort_order: 6,
        }
      ];

      for (let i = 0; i < CUSTOMERS_FA.length; i++) {
        const doc = await strapi.documents('api::customer.customer').create({
          locale: 'fa',
          data: { ...CUSTOMERS_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::customer.customer').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...CUSTOMERS_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] Customers seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] Customers seed failed:', e);
  }
}

async function seedBusinessPartners(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::business-partner.business-partner').count({ locale: 'fa' });

    if (count === 0) {
      for (let i = 0; i < BUSINESS_PARTNERS_FA.length; i++) {
        const doc = await strapi.documents('api::business-partner.business-partner').create({
          locale: 'fa',
          data: { ...BUSINESS_PARTNERS_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::business-partner.business-partner').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...BUSINESS_PARTNERS_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] BusinessPartners seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] BusinessPartners seed failed:', e);
  }
}

async function seedSmartPackages(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::smart-package.smart-package').count({ locale: 'fa' });

    if (count === 0) {
      for (let i = 0; i < SMART_PACKAGES_FA.length; i++) {
        const doc = await strapi.documents('api::smart-package.smart-package').create({
          locale: 'fa',
          data: { ...SMART_PACKAGES_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::smart-package.smart-package').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...SMART_PACKAGES_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] SmartPackages seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] SmartPackages seed failed:', e);
  }
}

async function seedFeaturesConfig(strapi: Core.Strapi) {
  try {
    const existing = await strapi
      .documents('api::features-config.features-config')
      .findFirst({ locale: 'fa' });

    if (!existing) {
      const doc = await strapi
        .documents('api::features-config.features-config')
        .create({ locale: 'fa', data: FEATURES_CONFIG_FA });

      await strapi
        .documents('api::features-config.features-config')
        .update({ documentId: doc.documentId, locale: 'en', data: FEATURES_CONFIG_EN });

      strapi.log.info('[seed] FeaturesConfig seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] FeaturesConfig seed failed:', e);
  }
}

async function seedFeatureCards(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::feature-card.feature-card').count({ locale: 'fa' });

    if (count === 0) {
      for (let i = 0; i < FEATURE_CARDS_FA.length; i++) {
        const doc = await strapi.documents('api::feature-card.feature-card').create({
          locale: 'fa',
          data: { ...FEATURE_CARDS_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::feature-card.feature-card').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...FEATURE_CARDS_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] FeatureCards seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] FeatureCards seed failed:', e);
  }
}

async function seedServices(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::service.service').count({ locale: 'fa' });

    if (count === 0) {
      for (let i = 0; i < SERVICES_FA.length; i++) {
        const doc = await strapi.documents('api::service.service').create({
          locale: 'fa',
          data: { ...SERVICES_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::service.service').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...SERVICES_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] Services seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] Services seed failed:', e);
  }
}

// ─── Bootstrap ────────────────────────────────────────────────────────────────

async function seedPublicPermissions(strapi: Core.Strapi) {
  strapi.log.info('[seed] ⚠️  Permissions must be manually configured in Admin panel:');
  strapi.log.info('[seed] Settings → Users & Permissions → Roles → Public');
  strapi.log.info('[seed] Enable "find" and "findOne" for all Content Types');
}

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureLocales(strapi);
    await seedHeroConfig(strapi);
    await seedCalculatorConfig(strapi);
    await seedProducts(strapi);
    await seedSmartPackages(strapi);
    await seedFeaturesConfig(strapi);
    await seedFeatureCards(strapi);
    await seedServices(strapi);
    await seedBusinessPartners(strapi);
    await seedCustomers(strapi);
    await seedTestimonials(strapi);
    await seedGalleryGroups(strapi);
    await seedGalleryItems(strapi);
    await connectGalleryItemsToGroups(strapi);
    await seedContentManagerConfigs(strapi);
    await seedPublicPermissions(strapi);
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function ensureLocales(strapi: Core.Strapi) {
  try {
    const localeService = strapi.plugin('i18n').service('locales');
    const existing: { code: string }[] = await localeService.find();
    const codes = existing.map((l: { code: string }) => l.code);

    if (!codes.includes('fa')) {
      await localeService.create({ code: 'fa', name: 'Persian (Iran)', isDefault: true });
      strapi.log.info('[seed] Locale "fa" created');
    }
    if (!codes.includes('en')) {
      await localeService.create({ code: 'en', name: 'English', isDefault: false });
      strapi.log.info('[seed] Locale "en" created');
    }
  } catch (e) {
    strapi.log.warn('[seed] ensureLocales failed:', e);
  }
}

async function seedHeroConfig(strapi: Core.Strapi) {
  try {
    const existing = await strapi
      .documents('api::hero-config.hero-config')
      .findFirst({ locale: 'fa' });

    if (!existing) {
      const doc = await strapi
        .documents('api::hero-config.hero-config')
        .create({ locale: 'fa', data: HERO_FA });

      await strapi
        .documents('api::hero-config.hero-config')
        .update({ documentId: doc.documentId, locale: 'en', data: HERO_EN });

      strapi.log.info('[seed] HeroConfig seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] HeroConfig seed failed:', e);
  }
}

async function seedCalculatorConfig(strapi: Core.Strapi) {
  try {
    const existing = await strapi
      .documents('api::calculator-config.calculator-config')
      .findFirst({ locale: 'fa' });

    if (!existing) {
      const doc = await strapi
        .documents('api::calculator-config.calculator-config')
        .create({ locale: 'fa', data: CALC_FA });

      await strapi
        .documents('api::calculator-config.calculator-config')
        .update({ documentId: doc.documentId, locale: 'en', data: CALC_EN });

      strapi.log.info('[seed] CalculatorConfig seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] CalculatorConfig seed failed:', e);
  }
}

async function seedProducts(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::product.product').count({ locale: 'fa' });

    if (count === 0) {
      for (let i = 0; i < PRODUCTS_FA.length; i++) {
        const doc = await strapi.documents('api::product.product').create({
          locale: 'fa',
          data: { ...PRODUCTS_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::product.product').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...PRODUCTS_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] Products seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] Products seed failed:', e);
  }
}

async function seedGalleryItems(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::gallery-item.gallery-item').count({ locale: 'fa' });

    if (count === 0) {
      for (let i = 0; i < GALLERY_ITEMS_FA.length; i++) {
        const doc = await strapi.documents('api::gallery-item.gallery-item').create({
          locale: 'fa',
          data: { ...GALLERY_ITEMS_FA[i], publishedAt: new Date() },
        });

        await strapi.documents('api::gallery-item.gallery-item').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...GALLERY_ITEMS_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] GalleryItems seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] GalleryItems seed failed:', e);
  }
}

async function seedGalleryGroups(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::gallery-group.gallery-group').count({ locale: 'fa' });
    if (count === 0) {
      for (let i = 0; i < GALLERY_GROUPS_FA.length; i++) {
        const doc = await strapi.documents('api::gallery-group.gallery-group').create({
          locale: 'fa',
          data: { ...GALLERY_GROUPS_FA[i], publishedAt: new Date() },
        });
        await strapi.documents('api::gallery-group.gallery-group').update({
          documentId: doc.documentId,
          locale: 'en',
          data: { ...GALLERY_GROUPS_EN[i], publishedAt: new Date() },
        });
      }
      strapi.log.info('[seed] GalleryGroups seeded (fa + en)');
    }
  } catch (e) {
    strapi.log.warn('[seed] GalleryGroups seed failed:', e);
  }
}

async function connectGalleryItemsToGroups(strapi: Core.Strapi) {
  try {
    // idempotency: if first item already has groups, skip
    const firstItems = await strapi.documents('api::gallery-item.gallery-item').findMany({
      locale: 'fa',
      populate: ['gallery_groups'],
      limit: 1,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (firstItems.length && (firstItems[0] as any).gallery_groups?.length > 0) {
      strapi.log.info('[seed] GalleryGroup connections already exist — skipped');
      return;
    }

    // Build slug → documentId map from seeded groups
    const groups = await strapi.documents('api::gallery-group.gallery-group').findMany({ locale: 'fa' });
    const groupBySlug: Record<string, string> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const g of groups as any[]) {
      groupBySlug[g.slug] = g.documentId;
    }

    // Connect each item to its group based on category (fa)
    const items = await strapi.documents('api::gallery-item.gallery-item').findMany({ locale: 'fa' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of items as any[]) {
      const slug = GALLERY_CATEGORY_TO_SLUG[item.category ?? ''];
      const groupDocId = slug ? groupBySlug[slug] : undefined;
      if (!groupDocId) continue;
      await strapi.documents('api::gallery-item.gallery-item').update({
        documentId: item.documentId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: { gallery_groups: { connect: [{ documentId: groupDocId }] } } as any,
      });
    }
    strapi.log.info('[seed] GalleryGroup connections established');
  } catch (e) {
    strapi.log.warn('[seed] GalleryGroup connections failed:', e);
  }
}

async function seedTestimonials(strapi: Core.Strapi) {
  try {
    const count = await strapi.documents('api::testimonial.testimonial').count({ locale: 'fa' });

    if (count === 0) {
      // Create testimonials for Persian locale
      for (const testimonial of TESTIMONIALS_FA) {
        await strapi.documents('api::testimonial.testimonial').create({
          locale: 'fa',
          data: testimonial,
          publish: true,
        });
      }
      strapi.log.info('[seed] Testimonials created for fa');

      // Get created testimonials and create English versions
      const faTestimonials = await strapi.documents('api::testimonial.testimonial').findMany({ locale: 'fa' });
      for (let i = 0; i < faTestimonials.length; i++) {
        const enData = TESTIMONIALS_EN[i];
        await strapi.documents('api::testimonial.testimonial').update({
          documentId: faTestimonials[i].documentId,
          locale: 'en',
          data: enData,
          publish: true,
        });
      }
      strapi.log.info('[seed] Testimonials created for en');
    }
  } catch (e) {
    strapi.log.warn('[seed] seedTestimonials failed:', e);
  }
}

// ─── تنظیم label فارسی فیلدها در فرم ویرایش Content Manager ──────────────────
// این تابع یک‌بار اجرا می‌شود و label/description هر فیلد را در دیتابیس ذخیره
// می‌کند. بعد از اولین اجرا، تغییرات دستی از پنل ادمین (Configure the view)
// اولویت دارند و این تابع دیگر بازنویسی نمی‌کند (idempotent).

async function seedContentManagerConfigs(strapi: Core.Strapi) {
  const targets = [
    {
      uid: 'api::hero-config.hero-config',
      meta: HERO_FIELD_META,
      mainField: 'heading',
    },
    {
      uid: 'api::calculator-config.calculator-config',
      meta: CALC_FIELD_META,
      mainField: 'high_profit_msg',
    },
    {
      uid: 'api::product.product',
      meta: PRODUCT_FIELD_META,
      mainField: 'title',
    },
    {
      uid: 'api::smart-package.smart-package',
      meta: SMART_PACKAGE_FIELD_META,
      mainField: 'name',
    },
    {
      uid: 'api::features-config.features-config',
      meta: FEATURES_CONFIG_FIELD_META,
      mainField: 'section_title',
    },
    {
      uid: 'api::feature-card.feature-card',
      meta: FEATURE_CARD_FIELD_META,
      mainField: 'title',
    },
    {
      uid: 'api::business-partner.business-partner',
      meta: BUSINESS_PARTNER_FIELD_META,
      mainField: 'name',
    },
    {
      uid: 'api::gallery-item.gallery-item',
      meta: {
        title:          { label: 'عنوان',          description: 'عنوان تصویر — نمایش‌داده‌شده روی کارت هنگام hover و در لایت‌باکس', sortable: true },
        caption:        { label: 'توضیح',          description: 'توضیح کوتاه تصویر — نمایش در لایت‌باکس زیر عنوان' },
        category:       { label: 'دسته‌بندی',      description: 'برچسب دسته — مثال: بازی و سرگرمی، رضایت مشتری. برای fallback فیلتر استفاده می‌شود.', sortable: true },
        image:          { label: 'تصویر',          description: 'فایل تصویری — JPG، PNG، WebP. مشترک بین زبان‌ها' },
        sort_order:     { label: 'ترتیب نمایش',   description: 'عدد کمتر = نمایش زودتر', sortable: true },
        gallery_groups: { label: 'گروه‌های گالری', description: 'این تصویر به کدام گروه‌ها تعلق دارد — هر تصویر می‌تواند عضو چند گروه باشد' },
      },
      mainField: 'title',
    },
    {
      uid: 'api::gallery-group.gallery-group',
      meta: GALLERY_GROUP_FIELD_META,
      mainField: 'name',
    },
    {
      uid: 'api::service.service',
      meta: SERVICE_FIELD_META,
      mainField: 'title',
    },
    {
      uid: 'api::testimonial.testimonial',
      meta: TESTIMONIAL_FIELD_META,
      mainField: 'author_name',
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = (strapi as any).store({
    type: 'plugin',
    name: 'content-manager',
  });

  for (const { uid, meta, mainField } of targets) {
    try {
      const key = `configuration::${uid}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const existing = (await store.get({ key })) as Record<string, any> | null;

      // idempotency: اگر label اولین فیلد قبلاً فارسی شده، رد شو
      const firstField = Object.keys(meta)[0];
      if (existing?.metadatas?.[firstField]?.edit?.label === meta[firstField].label) {
        strapi.log.info(`[seed] CM labels already set for ${uid} — skipped`);
        continue;
      }

      // ساخت metadatas با label و description فارسی
      const metadatas: Record<string, unknown> = { ...(existing?.metadatas ?? {}) };
      for (const [field, { label, description, sortable }] of Object.entries(meta)) {
        metadatas[field] = {
          edit: {
            label,
            description,
            placeholder: '',
            visible: true,
            editable: true,
          },
          list: {
            label,
            searchable: true,
            sortable: sortable ?? false,
          },
        };
      }

      await store.set({
        key,
        value: {
          ...(existing ?? {}),
          settings: {
            ...(existing?.settings ?? {}),
            mainField,
          },
          metadatas,
        },
      });

      strapi.log.info(`[seed] CM Persian labels set for ${uid}`);
    } catch (e) {
      strapi.log.warn(`[seed] CM config failed for ${uid}:`, e);
    }
  }
}
