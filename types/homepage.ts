export type BlockType =
  | 'hero'
  | 'category_carousel'
  | 'image_banner'
  | 'text_block'
  | 'featured_products';

export interface HeroConfig {
  image?: string;
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
  productIds: string[];
  title?: string;
}

export type SectionConfig = HeroConfig | CarouselConfig | BannerConfig | TextConfig | FeaturedConfig;

export interface HomepageSection {
  id: string;
  type: BlockType;
  enabled: boolean;
  config: SectionConfig;
}
