'use client';

import { useState } from 'react';
import { Product, CategoryDoc } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: CategoryDoc[];
  initialCategory?: string;
}

export default function ProductGrid({ products, categories, initialCategory = 'todos' }: ProductGridProps) {
  const [active, setActive] = useState(initialCategory);

  const filtered = products.filter(p =>
    active === 'todos' || p.categories.includes(active)
  );

  const allFilters = [
    { label: 'Todos', value: 'todos' },
    ...categories.map(c => ({ label: c.name, value: c.name })),
  ];

  return (
    <section className="flex flex-col gap-6 lg:gap-10">

      {/* Heading con número oversized — solo desktop */}
      <div className="relative hidden lg:block">
        <span
          className="absolute -top-10 left-0 text-[10rem] font-black text-gray-100/80 leading-none select-none pointer-events-none"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
          aria-hidden="true"
        >
          01
        </span>
        <div className="relative pt-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-black font-semibold mb-2">
            <span>✦</span> Catálogo
          </p>
          <h2 className="text-4xl sm:text-5xl text-black">Colección completa</h2>
        </div>
      </div>

      {/* Filtros categoría — tabs con underline */}
      <div className="flex gap-6 overflow-x-auto scrollbar-none border-b border-gray-100 pb-0">
        {allFilters.map(f => (
          <button
            key={f.value}
            onClick={() => setActive(f.value)}
            className={`shrink-0 pb-3 text-sm font-semibold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px ${
              active === f.value
                ? 'text-black border-black'
                : 'text-gray-400 border-transparent hover:text-black'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
        {filtered.length} {filtered.length !== 1 ? 'productos' : 'producto'}
      </p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-x-5 lg:gap-y-8">
          {filtered.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={i < 4}
              delay={Math.min(i, 7) * 70}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center text-gray-300 text-sm tracking-widest uppercase">
          Sin productos en esta categoría
        </div>
      )}

    </section>
  );
}
