import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCarousel from '@/components/ProductCarousel';
import CategoryBanner from '@/components/CategoryBanner';
import { HomepageSection, HeroConfig, CarouselConfig, BannerConfig, TextConfig, FeaturedConfig } from '@/types/homepage';
import { Product, CategoryDoc } from '@/types';

interface Props {
  sections: HomepageSection[];
  allProducts: Product[];
  categoryMeta: Record<string, CategoryDoc>;
}

export default function HomepageRenderer({ sections, allProducts, categoryMeta }: Props) {
  const enabled = sections.filter(s => s.enabled);

  return (
    <>
      {enabled.map((section, i) => {
        switch (section.type) {

          case 'hero': {
            const cfg = section.config as HeroConfig;
            return <Hero key={section.id} heroImage={cfg.image || '/images/portada.jpeg'} />;
          }

          case 'category_carousel': {
            const cfg = section.config as CarouselConfig;
            if (!cfg.categoryName) return null;
            const products = allProducts.filter(p => p.categories.includes(cfg.categoryName));
            const meta = categoryMeta[cfg.categoryName];
            return (
              <ProductCarousel
                key={section.id}
                title={cfg.titleOverride || cfg.categoryName}
                subtitle={cfg.subtitleOverride || meta?.subtitle}
                categoryName={cfg.categoryName}
                products={products}
                maxProducts={cfg.maxProducts || 4}
                index={i}
              />
            );
          }

          case 'image_banner': {
            const cfg = section.config as BannerConfig;
            return (
              <CategoryBanner
                key={section.id}
                imageSrc={cfg.image}
                categoryName={cfg.text || ''}
              />
            );
          }

          case 'text_block': {
            const cfg = section.config as TextConfig;
            const isDark = cfg.bg === 'black';
            if (!cfg.heading && !cfg.body) return null;
            return (
              <section key={section.id} className={`py-20 px-6 ${isDark ? 'bg-black text-white' : 'bg-white text-black border-t border-gray-100'}`}>
                <div className="max-w-3xl mx-auto text-center">
                  {cfg.heading && (
                    <h2
                      className={`text-3xl sm:text-4xl mb-4 font-medium leading-tight`}
                      style={{ fontFamily: 'var(--font-dm-serif)', fontStyle: 'italic' }}
                    >
                      {cfg.heading}
                    </h2>
                  )}
                  {cfg.body && (
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                      {cfg.body}
                    </p>
                  )}
                </div>
              </section>
            );
          }

          case 'featured_products': {
            const cfg = section.config as FeaturedConfig;
            const products = allProducts.filter(p => (cfg.productIds ?? []).includes(p.id));
            if (products.length === 0) return null;
            return (
              <ProductCarousel
                key={section.id}
                title={cfg.title || 'Destacados'}
                categoryName=""
                products={products}
                maxProducts={products.length}
                index={i}
              />
            );
          }

          default:
            return null;
        }
      })}

      {/* CTA ver colección completa */}
      {enabled.some(s => s.type === 'category_carousel' || s.type === 'featured_products') && (
        <div className="border-t border-gray-100 py-14 flex flex-col items-center gap-4 px-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
            ✦ Todos los productos
          </p>
          <Link
            href="/coleccion"
            className="inline-block border-2 border-black text-black text-xs font-semibold uppercase tracking-widest px-8 py-3.5 rounded-full hover:bg-black hover:text-white transition-all duration-200 active:scale-95"
          >
            Ver colección completa
          </Link>
        </div>
      )}
    </>
  );
}
