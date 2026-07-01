'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product, CategoryDoc } from '@/types';
import ProductCard from '@/components/ProductCard';

const PAGE_SIZE = 12;
type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name';

interface ProductGridProps {
  products: Product[];
  categories: CategoryDoc[];
  initialCategory?: string;
}

export default function ProductGrid({ products, categories, initialCategory = 'todos' }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(initialCategory);
  const [sort, setSort] = useState<SortKey>('default');
  const [page, setPage] = useState(1);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Sync with URL when user clicks filter
  function selectCategory(value: string) {
    setActive(value);
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'todos') {
      params.delete('categoria');
    } else {
      params.set('categoria', value);
    }
    router.push(`/coleccion?${params.toString()}`, { scroll: false });
  }

  // Keep local state in sync if URL changes externally (e.g. browser back)
  useEffect(() => {
    const cat = searchParams.get('categoria') ?? 'todos';
    setActive(cat);
    setPage(1);
  }, [searchParams]);

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

  const shown = sorted.slice(0, page * PAGE_SIZE);
  const hasMore = shown.length < sorted.length;

  const allFilters = [
    { label: 'Todos', value: 'todos' },
    ...categories.map(c => ({ label: c.name, value: c.name })),
  ];

  // Counts per category
  const counts = useMemo(() => {
    const map: Record<string, number> = { todos: products.length };
    for (const c of categories) {
      map[c.name] = products.filter(p => p.categories.includes(c.name)).length;
    }
    return map;
  }, [products, categories]);

  return (
    <section className="flex flex-col gap-6 lg:gap-10">

      {/* Heading editorial */}
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
        {/* Scroll container con fade lateral */}
        <div className="relative flex-1 min-w-0">
          <div
            ref={filterBarRef}
            className="flex gap-6 overflow-x-auto scrollbar-none"
          >
            {allFilters.map(f => (
              <button
                key={f.value}
                onClick={() => selectCategory(f.value)}
                className={`shrink-0 pb-3 text-sm font-semibold uppercase tracking-widest transition-all duration-200 border-b-2 -mb-px flex items-baseline gap-1.5 ${
                  active === f.value
                    ? 'text-black border-black'
                    : 'text-gray-400 border-transparent hover:text-black'
                }`}
              >
                {f.label}
                <span className={`text-[10px] font-normal transition-colors ${active === f.value ? 'text-gray-500' : 'text-gray-300'}`}>
                  {counts[f.value] ?? 0}
                </span>
              </button>
            ))}
          </div>
          {/* Fade right indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none lg:hidden" />
        </div>

        <select
          value={sort}
          onChange={e => { setSort(e.target.value as SortKey); setPage(1); }}
          className="shrink-0 pb-3 text-[11px] uppercase tracking-widest text-gray-400 bg-transparent border-none outline-none cursor-pointer hover:text-black transition-colors mb-px"
        >
          <option value="default">Relevancia</option>
          <option value="price-asc">Precio ↑</option>
          <option value="price-desc">Precio ↓</option>
          <option value="name">Nombre A–Z</option>
        </select>
      </div>

      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
        {sorted.length} {sorted.length !== 1 ? 'productos' : 'producto'}
      </p>

      {sorted.length > 0 ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-14">
            {shown.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={i < 4}
                delay={Math.min(i % PAGE_SIZE, 7) * 70}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex flex-col items-center gap-3 pt-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Mostrando {shown.length} de {sorted.length}
              </p>
              <button
                onClick={() => setPage(p => p + 1)}
                className="border border-black text-black text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-200 active:scale-95"
              >
                Ver más
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="py-20 flex flex-col items-center gap-5 text-center">
          <p className="text-gray-300 text-sm tracking-widest uppercase">
            Sin productos en esta categoría
          </p>
          <button
            onClick={() => selectCategory('todos')}
            className="text-[10px] uppercase tracking-widest border-b border-gray-300 hover:border-black text-gray-400 hover:text-black transition-colors pb-px"
          >
            Ver toda la colección →
          </button>
          {categories.filter(c => c.name !== active && products.some(p => p.categories.includes(c.name))).slice(0, 3).map(c => (
            <button
              key={c.name}
              onClick={() => selectCategory(c.name)}
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Explorar {c.name} ({counts[c.name]})
            </button>
          ))}
        </div>
      )}

    </section>
  );
}
