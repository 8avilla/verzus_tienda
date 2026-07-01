'use client';

import { useState, useMemo } from 'react';
import { Product, CategoryDoc } from '@/types';
import ProductCard from '@/components/ProductCard';

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

interface ProductGridProps {
  products: Product[];
  categories: CategoryDoc[];
  initialCategory?: string;
}

export default function ProductGrid({ products, categories, initialCategory = 'todos' }: ProductGridProps) {
  const [active, setActive] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>('default');

  const filtered = products.filter(p =>
    active === 'todos' || p.categories.includes(active)
  );

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sort === 'price-asc') return arr.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return arr.sort((a, b) => b.price - a.price);
    if (sort === 'name') return arr.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    return arr;
  }, [filtered, sort]);

  const allFilters = [
    { label: 'Todos', value: 'todos' },
    ...categories.map(c => ({ label: c.name, value: c.name })),
  ];

  return (
    <section className="flex flex-col gap-6 lg:gap-10">

      {/* Heading editorial — sin número decorativo */}
      <div className="flex flex-col gap-2 pt-2">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
          ✦ Catálogo
        </p>
        <h2
          className="text-4xl sm:text-5xl text-black font-normal italic"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          Colección completa
        </h2>
      </div>

      {/* Filtros + Sort */}
      <div className="flex items-end justify-between gap-4 border-b border-gray-100 pb-0">
        <div className="flex gap-6 overflow-x-auto scrollbar-none">
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
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortKey)}
          className="shrink-0 pb-3 text-[11px] uppercase tracking-widest text-gray-400 bg-transparent border-none outline-none cursor-pointer hover:text-black transition-colors mb-px"
        >
          <option value="default">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name">Nombre A–Z</option>
        </select>
      </div>

      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
        {sorted.length} {sorted.length !== 1 ? 'productos' : 'producto'}
      </p>

      {sorted.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-14">
          {sorted.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={i < 4}
              delay={Math.min(i, 7) * 70}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-gray-300 text-sm tracking-widest uppercase">Sin productos en esta categoría</p>
        </div>
      )}

    </section>
  );
}
