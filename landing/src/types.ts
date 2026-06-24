
export interface StrapiResponse<T> {
  data: T;
  meta: any;
}

export type QualityLevel = 'economic' | 'standard' | 'professional' | 'premium';

export interface Package {
  id: string;
  name: string;
  products: string[];
  advantage: string;
  responseTime: string;
  priceRange: string;
  minBudget: number;
}

export interface CalculatorState {
  budget: number;
  seats: number;
  waitTime: number;
  quality: QualityLevel;
}

export interface RecommendationResult {
  recommendedPackage: Package | null;
  warning?: string;
  suggestion?: string;
  error?: string;
}

// Strapi 5 REST API returns flat objects (no attributes wrapper)
export interface Product {
  id: number;
  documentId: string;
  title: string;
  description: string;
  features: string;
  price: string;
  shop_url: string;
  image: { url: string } | null;
  long_description: string | null;
  enabled?: boolean;
  locale: string;
}

export interface HeroConfig {
  id: number;
  documentId: string;
  badge: string;
  heading: string;
  subtitle: string;
  subtitle_highlight_1: string;
  subtitle_highlight_2: string;
  cta_text: string;
  scroll_hint: string;
  scroll_fade_start: number;
  scroll_fade_end: number;
  scroll_scale_end: number;
  scroll_y_end: number;
  morph_1_threshold: number;
  morph_2_threshold: number;
  morph_3_threshold: number;
  enabled?: boolean;
  locale: string;
}

export interface CalculatorConfig {
  id: number;
  documentId: string;
  default_visitors: number;
  default_wait_time: number;
  default_participation: number;
  default_engagement: number;
  default_attention_value: number;
  default_conversion: number;
  default_profit: number;
  subscription_cost: number;
  high_profit_msg: string;
  mid_profit_msg: string;
  low_profit_msg: string;
  enabled?: boolean;
  locale: string;
}

export interface FeaturesConfig {
  id: number;
  documentId: string;
  section_title: string;
  section_subtitle: string;
  enabled?: boolean;
  locale: string;
}

export interface SmartPackage {
  id: number;
  documentId: string;
  package_key: 'economic' | 'standard' | 'professional' | 'enterprise' | 'premium';
  name: string;
  products: string;
  advantage: string;
  response_time: string;
  price_range: string;
  min_budget: number;
  sort_order: number;
  enabled?: boolean;
  locale: string;
}

export interface FeatureCard {
  id: number;
  documentId: string;
  title: string;
  description: string;
  content_title: string;
  content_description: string;
  media: { url: string; mime: string } | null;
  sort_order: number;
  locale: string;
}

export interface BusinessPartner {
  id: number;
  documentId: string;
  name: string;
  company: string;
  location: string;
  since: string;
  achievements: string | null;
  description: string;
  logo: { url: string } | null;
  sort_order: number;
  enabled?: boolean;
  locale: string;
}

export interface GalleryGroup {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  sort_order: number;
  enabled?: boolean;
  locale: string;
}

export interface GalleryItem {
  id: number;
  documentId: string;
  title: string;
  caption: string | null;
  category: string | null;
  image: { id?: number; url: string; width?: number; height?: number } | null;
  sort_order: number;
  enabled?: boolean;
  locale: string;
  gallery_groups?: Array<{ id: number; documentId: string; slug: string; name: string }>;
}

export interface CalculatorInputs {
  visitors: number;
  waitTime: number;
  participation: number;
  engagement: number;
  attentionValue: number;
  conversion: number;
  profit: number;
  subscriptionCost: number;
}

export interface CalculatorResults {
  totalWaitTime: number;
  realEngagementTime: number;
  attentionValueGenerated: number;
  extraSalesCount: number;
  dailyDirectIncome: number;
  dailyTotalBenefit: number;
  monthlyTotalBenefit: number;
  monthlyNetProfit: number;
  roi: number;
}

export interface Testimonial {
  id: number;
  documentId: string;
  author_name: string;
  company: string | null;
  position: string | null;
  comment: string;
  rating: number;
  avatar: { url: string } | null;
  sort_order: number;
  featured?: boolean;
  enabled?: boolean;
  locale: string;
}

export interface Service {
  id: number;
  documentId: string;
  title: string;
  description: string;
  features: string;
  icon: 'Code' | 'Wrench' | 'Server' | 'Smartphone' | 'Package' | 'Star';
  enabled?: boolean;
  locale: string;
}

export interface Customer {
  id: number;
  documentId: string;
  name: string;
  company: string | null;
  avatar: { url: string } | null;
  logo: { url: string } | null;
  testimonial: string | null;
  sort_order: number;
  enabled?: boolean;
  locale: string;
}

export interface FooterLink {
  text: string;
  url: string;
}

export interface Footer {
  id: number;
  documentId: string;
  brand_name: string;
  brand_description: string;
  quick_links: FooterLink[];
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  copyright_text: string;
  terms_link: string;
  privacy_link: string;
  enabled?: boolean;
  locale: string;
}



