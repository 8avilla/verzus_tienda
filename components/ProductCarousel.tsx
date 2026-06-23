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
        <div className="mb-6 lg:mb-8 text-center flex flex-col items-center gap-1.5">
          <h2 className="text-[26px] font-medium leading-tight" style={{ color: '#282828' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-[17px] font-normal" style={{ color: '#282828' }}>{subtitle}</p>
          )}
          <Link
            href={`/coleccion?categoria=${encodeURIComponent(categoryName)}`}
            className="text-[15px] font-normal tracking-wide underline underline-offset-4 hover:opacity-60 transition-opacity mt-0.5"
            style={{ color: '#282828' }}
          >
            Tienda de {title}
          </Link>
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
