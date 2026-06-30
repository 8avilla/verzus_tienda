export type BlockType =
  | 'hero'
  | 'category_carousel'
  | 'image_banner'
  | 'text_block'
  | 'featured_products'
  | 'collection_grid';

export interface HeroSlide {
  image?: string;
  eyebrow?: string;
  headingLine1?: string;
  headingLine2?: string;
  body?: string;
  cta?: string;
  mobileTitle?: string;
  year?: string;
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
  productIds: string[];
  title?: string;
}

export interface CollectionGridItem {
  image?: string;
  title: string;
  link?: string;
}

export interface CollectionGridConfig {
  items: CollectionGridItem[];
}

export type SectionConfig = HeroConfig | CarouselConfig | BannerConfig | TextConfig | FeaturedConfig | CollectionGridConfig;

export interface HomepageSection {
  id: string;
  type: BlockType;
  enabled: boolean;
  config: SectionConfig;
}
