export type BlockType =
  | 'hero'
  | 'category_carousel'
  | 'image_banner'
  | 'text_block'
  | 'featured_products'
  | 'collection_grid'
  | 'lifestyle_banner'
  | 'instagram_grid'
  | 'testimonials';

export type HeroTextAlign = 'left' | 'center' | 'right';
export type HeroTextVertical = 'top' | 'middle' | 'bottom';
export type HeroHeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface HeroSlide {
  image?: string;
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  body?: string;
  cta?: string;
  mobileTitle?: string;
  year?: string;
  // Desktop layout
  textAlign?: HeroTextAlign;
  textVertical?: HeroTextVertical;
  headingSize?: HeroHeadingSize;
  // Mobile overrides
  mobileImage?: string;
  mobileTextAlign?: HeroTextAlign;
  mobileTextVertical?: HeroTextVertical;
  mobileHeadingSize?: HeroHeadingSize;
}

export interface HeroConfig extends HeroSlide {
  slides?: HeroSlide[];
}

export interface CarouselConfig {
  categoryName: string;
  maxProducts: number;
  titleOverride?: string;
  subtitleOverride?: string;
}

export interface BannerConfig {
  image?: string;
  text?: string;
  link?: string;
}

export interface TextConfig {
  heading?: string;
  body?: string;
  bg?: 'white' | 'black';
}

export interface FeaturedConfig {
  productIds?: string[];
  title?: string;
  useFeatured?: boolean;
}

export interface CollectionGridItem {
  image?: string;
  title: string;
  subtitle?: string;
  link?: string;
}

export interface CollectionGridConfig {
  items: CollectionGridItem[];
}

export interface LifestyleBannerConfig {
  label?: string;
  heading?: string;
  body?: string;
  cta?: string;
  link?: string;
  images?: string[];
  bg?: 'light' | 'dark';
}

export interface InstagramGridConfig {
  handle?: string;
  images?: string[];
}

export interface TestimonialItem {
  name: string;
  text: string;
  rating?: number;
  location?: string;
}

export interface TestimonialsConfig {
  label?: string;
  heading?: string;
  items?: TestimonialItem[];
}

export type SectionConfig =
  | HeroConfig
  | CarouselConfig
  | BannerConfig
  | TextConfig
  | FeaturedConfig
  | CollectionGridConfig
  | LifestyleBannerConfig
  | InstagramGridConfig
  | TestimonialsConfig;

export interface HomepageSection {
  id: string;
  type: BlockType;
  enabled: boolean;
  config: SectionConfig;
}
