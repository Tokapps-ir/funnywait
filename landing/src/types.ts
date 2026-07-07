import {getStrapiMediaUrl} from "@/src/lib/helpers.ts";

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
export interface Settings {
  id: number; // Can be a large integer that loses precision in JS, or string for very precise values
  documentId: string; // Can be a long UUID that loses precision in JS, or string
  createdAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
  updatedAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
  publishedAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
  locale: string; // Can be a long custom value that loses precision in some cases, or very large text
  brand_name: string; // Can be a long custom value that loses precision in some cases, or very large text
  brand_logo?: Media | null; // Can be a complex object with many nested properties, or very large data
  localizations?: Array<{ // Can be a complex object with many nested properties, or very large data
    id: number; // Can be a long integer that loses precision in JS, or string for very precise values
    documentId: string; // Can be a long UUID that loses precision in JS, or string
    createdAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
    updatedAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
    publishedAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
    locale: string; // Can be a long custom value that loses precision in some cases, or very large text
    brand_name?: string | null; // Can be a long custom value that loses precision in some cases, or very large text
  }>
} // Can be a complex object with many nested properties, or very large data
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
  video?: Video;
}
export interface Video {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  focalPoint: any | null;
  width: number | null;
  height: number | null;
  formats: any | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
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
  certificates: Certificate[];
  contact_address: string;
  contact_phone: string;
  contact_email: string;
  copyright_text: string;
  copyright_links: FooterLink[];
  enabled?: boolean;
  locale: string;
}


export interface Certificate{
  certificate: string;
}

export interface MediaFormat {
  name: string;
  hash?: number | null; // Can be a large integer that loses precision in JS, or string
  ext: string;
  mime?: string | null; // Can be undefined for non-image files in some cases, or "data:application/pdf;base64..."
  path?: string | null; // Can be a URL for remote files or "data:..."
  width?: number | null; // Can be undefined if format doesn't have dimensions (e.g., PDF)
  height?: number | null; // Can be undefined if format doesn't have dimensions (e.g., PDF)
  size?: number | null; // Size in KB, can be a large decimal that loses precision
  sizeInBytes?: number | null; // Size in bytes, can be a large integer that loses precision
  url: string | null; // Can include "data:" prefix for base64 encoded images
}

export interface Media {
  id: number; // Can be a large integer that loses precision in JS, or string for very precise values
  documentId: string; // Can be a long UUID that loses precision in JS, or string
  name?: string | null; // Can be a long filename that loses precision in some cases, or very large text
  alternativeText?: string | null; // Can be a long description that loses precision in some cases, or very large text
  caption?: string | null; // Can be a long description that loses precision in some cases, or very large text
  focalPoint?: { x: number | null; y: number | null } | null; // Can have very precise coordinates
  width?: number | null; // Width in pixels, can be a large integer that loses precision
  height?: number | null; // Height in pixels, can be a large integer that loses precision
  formats?: { [key: string]: MediaFormat }; // Can have many different format sizes, some with very large values
  hash?: string | number; // Can be a long hex value that loses precision in JS, or very large integer
  ext: string; // Can be a long extension for unusual file types, or very large text
  mime?: string | null; // Can be a long MIME type for unusual file types, or very large text
  size?: number | null; // Size in KB as decimal string that loses precision, or very large value
  url?: string | null; // Can be a long URL for remote files, or very large text
  previewUrl?: string | null; // Can be a long URL for remote files, or very large text
  provider?: string | null; // Can be a long custom value that loses precision in some cases, or very large text
  provider_metadata?: any; // Can be a complex object with many nested properties, or very large data
  createdAt?: string; // Can be a long timestamp that loses precision in some cases, or very large text
  updatedAt?: string; // Can be a long timestamp that loses precision in some cases, or very large text
  publishedAt?: string | null; // Can be a long timestamp that loses precision in some cases, or very large text
}

/**
 * Extracts the standard size image URL from a Media object.
 * Strapi uses format names like 'small', 'medium', 'large', 'lg', 'thumbnail', etc.
 * 'lg' is typically the standard/large size used in headers.
 */
export function getBrandLogoUrl(media: Media | null): string | Blob | undefined  {
  if (!media) return "#";
  
  // Try to get the 'lg' (large) format first, then fallback to other common sizes
  if (media.formats?.lg) {
    return getStrapiMediaUrl(media.formats.lg.url);
  }
  if (media.formats?.large) {
    return getStrapiMediaUrl(media.formats.large.url);
  }
  if (media.formats?.medium) {
    return getStrapiMediaUrl(media.formats.medium.url);
  }
  if (media.formats?.small) {
    return getStrapiMediaUrl(media.formats.small.url);
  }
  
  // Fallback to the main image URL
  return media.url?media.url:"#";
}

export function videoUrl(video: Video){
  console.log(video);
  return getStrapiMediaUrl(video.url);
}

export interface MainBusinessPageProps {
    settings: Settings;
    products: Product[]|any[];
    calcConfig: CalculatorConfig;
    heroConfig: HeroConfig;
    featuresConfig: FeaturesConfig;
    featureCards: FeatureCard[]|any[];
    smartPackages: Package[]|any[];
    galleryItems: GalleryItem[]|any[];
    galleryGroups: GalleryGroup[]|any[];
    testimonials: Testimonial[]|any[];
}