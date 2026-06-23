'use client';

import { useState } from 'react';
import { Product, CategoryDoc } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  categories: CategoryDoc[];
}

const PRICE_RANGES = [
  { label: 'Todos', min: 0, max: Infinity },
  { label: '< $50.000', min: 0, max: 50000 },
  { label: '$50k – $100k', min: 50000, max: 100000 },
  { label: '> $100.000', min: 100000, max: Infinity },
];

export default function ProductGrid({ products, categories }: ProductGridProps) {
  const [active, setActive] = useState('todos');
  const [priceRange, setPriceRange] = useState(0);

  const filtered = products.filter(p => {
    const categoryMatch = active === 'todos' || p.category === active;
    const range = PRICE_RANGES[priceRange];
    const priceMatch = p.price >= range.min && p.price < range.max;
    return categoryMatch && priceMatch;
  });

  const allFilters = [
    { label: 'Todos', value: 'todos' },
    ...categories.map(c => ({ label: c.name, value: c.slug })),
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
          <h2 className="text-4xl sm:text-5xl text-black">Colección</h2>
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

      {/* Filtros precio — pills */}
      <div className="flex gap-2 flex-wrap">
        {PRICE_RANGES.map((r, i) => (
          <button
            key={i}
            onClick={() => setPriceRange(i)}
            className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full border transition-all duration-150 ${
              priceRange === i
                ? 'text-white border-transparent'
                : 'border-gray-200 text-gray-500 hover:border-gray-800 hover:text-black bg-white'
            }`}
            style={priceRange === i ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : undefined}
          >
            {r.label}
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
