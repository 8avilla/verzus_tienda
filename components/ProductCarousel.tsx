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
        <div className="mb-6 lg:mb-8 flex items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl sm:text-2xl uppercase font-semibold tracking-tight" style={{ color: '#282828' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm font-normal text-gray-500">{subtitle}</p>
            )}
          </div>
          {categoryName && (
            <Link
              href={`/coleccion?categoria=${encodeURIComponent(categoryName)}`}
              className="shrink-0 text-[11px] uppercase tracking-widest font-semibold text-gray-500 hover:text-black transition-colors whitespace-nowrap"
            >
              Ver todas
            </Link>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-x-5 lg:gap-y-8">
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
