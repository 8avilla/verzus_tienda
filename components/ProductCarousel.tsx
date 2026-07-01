import Link from 'next/link';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface Props {
  title: string;
  subtitle?: string;
  categoryName: string;
  products: Product[];
  maxProducts?: number;
  index?: number;
}

export default function ProductCarousel({ title, subtitle, categoryName, products, maxProducts = 4, index = 0 }: Props) {
  if (products.length === 0) return null;

  const shown = products.slice(0, maxProducts);

  return (
    <section className="border-t border-gray-100 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8 lg:mb-12 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">✦ {subtitle || 'Colección'}</p>
            <h2
              className="text-3xl sm:text-4xl text-black font-normal leading-tight"
              style={{ fontFamily: 'var(--font-dm-serif)' }}
            >
              {title}
            </h2>
          </div>
          {categoryName && (
            <Link
              href={`/coleccion?categoria=${encodeURIComponent(categoryName)}`}
              className="shrink-0 text-[10px] uppercase tracking-[0.18em] font-semibold text-gray-400 hover:text-black transition-colors whitespace-nowrap border-b border-gray-300 hover:border-black pb-px"
            >
              Ver todas →
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-14">
          {shown.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index === 0 && i < 2}
              delay={i * 60}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
