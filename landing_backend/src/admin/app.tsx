import type { StrapiApp } from '@strapi/strapi/admin';

// ─── ترجمه‌های فارسی برای پنل مدیریت ──────────────────────────────────────────
//
// این فایل ظاهر و متن‌های پنل ادمین استرپی را سفارشی می‌کند.
// تغییر label هر فیلد در content manager از طریق:
//   پنل ادمین → Content Manager → [نوع محتوا] → Configure the view
// امکان‌پذیر است و نیازی به کد نویسی ندارد.
// ─────────────────────────────────────────────────────────────────────────────

const FA_TRANSLATIONS: Record<string, string> = {
  // ─── عنوان و برند ────────────────────────────────────────────────────────
  'app.components.LeftMenu.navbrand.title': 'FunnyWait CMS',
  'app.components.LeftMenu.navbrand.workplace': 'مدیریت محتوا',

  // ─── دکمه‌ها و اقدامات مشترک ─────────────────────────────────────────────
  'app.components.Button.save': 'ذخیره',
  'app.components.Button.cancel': 'انصراف',
  'app.components.Button.delete': 'حذف',
  'app.components.Button.confirm': 'تأیید',
  'app.components.Button.create': 'ایجاد',
  'app.components.Button.edit': 'ویرایش',
  'app.components.Button.publish': 'انتشار',
  'app.components.Button.unpublish': 'لغو انتشار',
  'app.components.Button.add': 'افزودن',

  // ─── Content Manager ──────────────────────────────────────────────────────
  'content-manager.plugin.name': 'مدیریت محتوا',
  'content-manager.header.name': 'مدیریت محتوا',
  'content-manager.containers.List.addAnItem': 'افزودن آیتم',
  'content-manager.components.DynamicZone.add-component': 'افزودن کامپوننت',
  'content-manager.components.Select.create-entry': 'ایجاد ورودی',
  'content-manager.components.Select.no-results': 'نتیجه‌ای یافت نشد',
  'content-manager.empty-permissions.subtitle':
    'دسترسی لازم برای ایجاد محتوا را ندارید',
  'content-manager.bulk-collection-type.unselect_all_entries': 'لغو انتخاب همه',
  'content-manager.components.not-allowed.permissions':
    'شما مجوز لازم برای دسترسی به این محتوا را ندارید.',

  // ─── وضعیت انتشار ─────────────────────────────────────────────────────────
  'content-manager.containers.List.draft': 'پیش‌نویس',
  'content-manager.containers.List.published': 'منتشرشده',
  'content-manager.containers.List.modified': 'ویرایش‌شده',

  // ─── فیلدهای «تنظیمات هیرو» ───────────────────────────────────────────────
  // label‌های زیر در صورت ست‌شدن از اینجا خوانده می‌شوند.
  // در غیر این صورت از نام فیلد (key) استفاده می‌شود.
  'api::hero-config.hero-config.badge': 'نشان‌واره',
  'api::hero-config.hero-config.heading': 'تیتر اصلی',
  'api::hero-config.hero-config.subtitle': 'زیرنویس',
  'api::hero-config.hero-config.subtitle_highlight_1': 'هایلایت اول',
  'api::hero-config.hero-config.subtitle_highlight_2': 'هایلایت دوم',
  'api::hero-config.hero-config.cta_text': 'متن دکمه اقدام',
  'api::hero-config.hero-config.scroll_hint': 'راهنمای اسکرول',
  'api::hero-config.hero-config.scroll_fade_start': 'شروع محو اسکرول',
  'api::hero-config.hero-config.scroll_fade_end': 'پایان محو اسکرول',
  'api::hero-config.hero-config.scroll_scale_end': 'مقیاس پایانی',
  'api::hero-config.hero-config.scroll_y_end': 'جابجایی عمودی',
  'api::hero-config.hero-config.morph_1_threshold': 'آستانه تبدیل ۱',
  'api::hero-config.hero-config.morph_2_threshold': 'آستانه تبدیل ۲',
  'api::hero-config.hero-config.morph_3_threshold': 'آستانه تبدیل ۳',

  // ─── فیلدهای «تنظیمات ماشین‌حساب» ────────────────────────────────────────
  'api::calculator-config.calculator-config.default_visitors': 'بازدیدکنندگان روزانه (پیش‌فرض)',
  'api::calculator-config.calculator-config.default_wait_time': 'زمان انتظار — دقیقه (پیش‌فرض)',
  'api::calculator-config.calculator-config.default_participation': 'نرخ مشارکت — % (پیش‌فرض)',
  'api::calculator-config.calculator-config.default_engagement': 'زمان تعامل — دقیقه (پیش‌فرض)',
  'api::calculator-config.calculator-config.default_attention_value': 'ارزش توجه — تومان (پیش‌فرض)',
  'api::calculator-config.calculator-config.default_conversion': 'نرخ تبدیل — % (پیش‌فرض)',
  'api::calculator-config.calculator-config.default_profit': 'سود هر فروش — تومان (پیش‌فرض)',
  'api::calculator-config.calculator-config.subscription_cost': 'هزینه اشتراک ماهانه — تومان',
  'api::calculator-config.calculator-config.high_profit_msg': 'پیام سود بالا',
  'api::calculator-config.calculator-config.mid_profit_msg': 'پیام سود متوسط',
  'api::calculator-config.calculator-config.low_profit_msg': 'پیام سود پایین',

  // ─── فیلدهای «محصولات» ────────────────────────────────────────────────────
  'api::product.product.title': 'عنوان محصول',
  'api::product.product.description': 'توضیحات',
  'api::product.product.features': 'ویژگی‌ها (با ویرگول جدا شود)',
  'api::product.product.price': 'قیمت',
  'api::product.product.shop_url': 'لینک خرید',
  'api::product.product.image': 'تصویر محصول',
  'api::product.product.long_description': 'توضیحات بلند (Markdown)',

  // ─── فیلدهای «پکیج هوشمند» ───────────────────────────────────────────────
  'api::smart-package.smart-package.package_key': 'کلید پکیج',
  'api::smart-package.smart-package.name': 'نام پکیج',
  'api::smart-package.smart-package.products': 'ویژگی‌ها (هر خط یک آیتم)',
  'api::smart-package.smart-package.advantage': 'مزیت اصلی',
  'api::smart-package.smart-package.response_time': 'زمان پاسخ پشتیبانی',
  'api::smart-package.smart-package.price_range': 'بازه قیمت',
  'api::smart-package.smart-package.min_budget': 'حداقل بودجه (تومان)',
  'api::smart-package.smart-package.sort_order': 'ترتیب نمایش',

  // ─── فیلدهای «تنظیمات بخش ویژگی‌ها» ──────────────────────────────────────
  'api::features-config.features-config.section_title': 'عنوان بخش',
  'api::features-config.features-config.section_subtitle': 'زیرعنوان بخش',

  // ─── فیلدهای «کارت ویژگی» ────────────────────────────────────────────────
  'api::feature-card.feature-card.title': 'عنوان / سوال',
  'api::feature-card.feature-card.description': 'توضیح کوتاه',
  'api::feature-card.feature-card.content_title': 'عنوان پنل جزئیات',
  'api::feature-card.feature-card.content_description': 'متن پنل جزئیات',
  'api::feature-card.feature-card.media': 'تصویر یا ویدیو',
  'api::feature-card.feature-card.sort_order': 'ترتیب نمایش',

  // ─── فیلدهای «همکاران تجاری» ─────────────────────────────────────────────
  'api::business-partner.business-partner.name': 'نام',
  'api::business-partner.business-partner.company': 'نام شرکت',
  'api::business-partner.business-partner.location': 'شهر',
  'api::business-partner.business-partner.since': 'سال شروع همکاری',
  'api::business-partner.business-partner.achievements': 'دستاوردها (هر خط یک آیتم)',
  'api::business-partner.business-partner.description': 'توضیح',
  'api::business-partner.business-partner.logo': 'لوگو',
  'api::business-partner.business-partner.sort_order': 'ترتیب نمایش',

  // ─── فیلدهای «نظرات مشتریان» ─────────────────────────────────────────────
  'api::testimonial.testimonial.author_name': 'نام مشتری',
  'api::testimonial.testimonial.company': 'نام شرکت/سازمان',
  'api::testimonial.testimonial.position': 'سمت یا عنوان شغلی',
  'api::testimonial.testimonial.comment': 'متن نظر',
  'api::testimonial.testimonial.rating': 'امتیاز (۱-۵)',
  'api::testimonial.testimonial.featured': 'نمایش در صفحه اصلی؟',
  'api::testimonial.testimonial.avatar': 'تصویر/آواتار',
  'api::testimonial.testimonial.sort_order': 'ترتیب نمایش',
};

export default {
  config: {
    // عنوان تب مرورگر در پنل ادمین
    head: {
      title: 'FunnyWait — پنل مدیریت',
    },

    locales: ['fa', 'en'],

    // ترجمه‌های سفارشی — «en» چون زبان پیش‌فرض ادمین استرپی انگلیسی است
    // و ما متن‌های آن را با معادل فارسی جایگزین می‌کنیم.
    translations: {
      en: FA_TRANSLATIONS,
    },
  },

  bootstrap(_app: StrapiApp) {
    // پس از راه‌اندازی ادمین اجرا می‌شود.
    // برای سفارشی‌سازی‌های پیشرفته‌تر (مثل افزودن منوی سفارشی) از اینجا استفاده کنید.
  },
};
