'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';
import { useCart } from '@/components/CartProvider';
import { usePopup } from '@/components/PopupProvider';
import { trackEvent } from '@/lib/sessionId';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  delay?: number;
}

const COLOR_MAP: Record<string, string> = {
  negro: '#1a1a1a',
  blanco: '#f0f0f0',
  rojo: '#E8001C',
  azul: '#2563eb',
  verde: '#16a34a',
  amarillo: '#eab308',
  gris: '#9ca3af',
  cafe: '#92400e',
  café: '#92400e',
  rosado: '#ec4899',
  rosa: '#f472b6',
  naranja: '#f97316',
  morado: '#7c3aed',
  beige: '#d2b48c',
  crema: '#fef3c7',
  marino: '#1e3a5f',
  turquesa: '#0d9488',
};

function isColorGroup(name: string) {
  return name.toLowerCase().includes('color');
}

function initSelections(product: Product): Record<string, string> {
  const result: Record<string, string> = {};
  for (const group of product.variantGroups ?? []) {
    if (group.options.length > 0) result[group.name] = group.options[0];
  }
  return result;
}

export default function ProductCard({ product, priority = false, delay = 0 }: ProductCardProps) {
  const { addItem, openSidebar } = useCart();
  const { openPopup } = usePopup();
  const [selections, setSelections] = useState<Record<string, string>>(() => initSelections(product));
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function prev(e: React.MouseEvent) {
    e.stopPropagation();
    setImgIdx(i => (i - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation();
    setImgIdx(i => (i + 1) % images.length);
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || !hasMultiple) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 40) return;
    setImgIdx(i => delta > 0 ? (i + 1) % images.length : (i - 1 + images.length) % images.length);
    touchStartX.current = null;
  }

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const doAdd = () => {
      addItem(product, Object.keys(selections).length > 0 ? selections : undefined);
      openSidebar();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      trackEvent('add_to_cart', { productId: product.id, productName: product.name, price: product.price });
    };
    if (product.showPopup && product.popupImage) {
      openPopup(doAdd, product.popupImage);
    } else {
      doAdd();
    }
  }

  const groups = product.variantGroups ?? [];

  return (
    <article
      ref={cardRef}
      style={{ animationDelay: `${delay}ms` }}
      className={`group flex flex-col h-full rounded-xl overflow-hidden bg-white ${
        visible ? 'animate-fade-up' : 'opacity-0'
      }`}
    >
      {/* Imagen */}
      <Link
        href={`/producto/${product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-gray-100 shrink-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length === 0 ? (
          <div className="w-full h-full bg-gray-100" />
        ) : (
          images.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt={i === 0 ? product.name : `${product.name} ${i + 1}`}
              fill
              className={`object-cover transition-[opacity,transform] duration-300 ease-out group-hover:scale-[1.07] group-hover:duration-700 ${
                i === imgIdx ? 'opacity-100' : 'opacity-0'
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority && i === 0}
              loading={priority && i === 0 ? undefined : 'lazy'}
            />
          ))
        )}

        {/* Overlay hover — solo desktop */}
        <div className="absolute inset-0 bg-black/0 lg:group-hover:bg-black/15 transition-colors duration-500" />

        {/* Badge AGOTADO — pill pequeño top-left */}
        {product.soldOut && (
          <div className="absolute top-2 left-2">
            <span
              className="text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              Agotado
            </span>
          </div>
        )}

        {/* Corazón favorito + badges de stock — esquina superior derecha */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); }}
            aria-label={liked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors shrink-0"
          >
            <svg
              className="w-3.5 h-3.5"
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: liked ? 'var(--accent)' : '#1a1a1a' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          {!product.soldOut && product.stockTracked && product.stock != null && product.stock > 0 && product.stock <= 5 && (
            <div className={`text-white text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-full shadow-sm whitespace-nowrap ${
              product.stock <= 2 ? 'bg-gray-500 animate-pulse' : 'bg-orange-400'
            }`}>
              {product.stock <= 2 ? `¡Último${product.stock === 1 ? '' : 's'}!` : `Solo ${product.stock}`}
            </div>
          )}
          {!product.soldOut && product.lastUnits && !(product.stockTracked && product.stock != null && product.stock > 0 && product.stock <= 5) && (
            <div className="bg-orange-500 animate-pulse text-white text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
              Últimas
            </div>
          )}
        </div>

        {/* Navegación entre imágenes */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-sm text-sm font-medium"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-sm text-sm font-medium"
            >
              ›
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    i === imgIdx ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Ícono ↗ — esquina inferior derecha */}
        <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 19.5l15-15M19.5 4.5H4.5M19.5 4.5v15" />
          </svg>
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col p-2 lg:p-4 gap-1 lg:gap-2">

        {/* Nombre */}
        <Link href={`/producto/${product.id}`} className="hover:opacity-70 transition-opacity">
          <h3 className="text-xs lg:text-sm font-medium text-black leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Precio */}
        <p
          className="text-sm font-bold text-black leading-none"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          ${product.price.toLocaleString('es-CO')}
        </p>

        {/* Variantes */}
        <div className="flex flex-col gap-1.5 mt-1">
          {groups.map(group => (
            <div key={group.name} className="flex flex-col gap-1">
              {!isColorGroup(group.name) && (
                <p className="text-[9px] uppercase tracking-wider text-gray-400">{group.name}</p>
              )}
              <div className="flex flex-wrap gap-1">
                {group.options.map(opt => {
                  const isColor = isColorGroup(group.name);
                  const cssColor = isColor
                    ? (opt.match(/^#[0-9a-fA-F]{3,8}$/) ? opt : (COLOR_MAP[opt.toLowerCase()] ?? '#e5e7eb'))
                    : null;
                  const isSelected = selections[group.name] === opt;

                  if (isColor) {
                    return (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelections(prev => ({ ...prev, [group.name]: opt }));
                          const mapped = group.imageMap?.[opt];
                          if (mapped !== undefined && mapped < images.length) setImgIdx(mapped);
                        }}
                        title={opt}
                        aria-label={opt}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-150 shrink-0 ${
                          isSelected ? 'border-black scale-110' : 'border-transparent hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: cssColor ?? undefined }}
                      />
                    );
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => setSelections(prev => ({ ...prev, [group.name]: opt }))}
                      className={`px-2 py-0.5 text-[9px] uppercase tracking-wide rounded-full border transition-all duration-150 shrink-0 ${
                        isSelected
                          ? 'text-white border-transparent'
                          : 'border-gray-200 text-gray-500 hover:border-black hover:text-black'
                      }`}
                      style={isSelected ? { backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' } : undefined}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA — solo desktop */}
      <div className="hidden lg:block px-4 pb-4">
        <button
          onClick={handleAdd}
          disabled={product.soldOut}
          className={`w-full py-3 text-xs font-semibold uppercase tracking-[0.15em] rounded-xl transition-all duration-200 active:scale-[0.97] select-none disabled:cursor-not-allowed ${
            product.soldOut ? 'bg-gray-100 text-gray-400' : added ? 'text-white btn-cart-added' : 'text-white'
          }`}
          style={!product.soldOut ? { backgroundColor: added ? 'var(--accent-hover)' : 'var(--accent)' } : undefined}
        >
          {product.soldOut ? 'Agotado' : added ? '✓ ¡Añadido!' : '+ Añadir al carrito'}
        </button>
      </div>

      {/* CTA mobile — tap en imagen lleva al producto, botón compacto de agregar */}
      {!product.soldOut && (
        <div className="lg:hidden px-2 pb-2">
          <button
            onClick={handleAdd}
            className={`w-full py-2 text-[10px] font-semibold uppercase tracking-wider rounded-lg transition-all active:scale-[0.97] select-none ${
              added ? 'text-white btn-cart-added' : 'text-white'
            }`}
            style={{ backgroundColor: added ? 'var(--accent-hover)' : 'var(--accent)' }}
          >
            {added ? '✓ Añadido' : '+ Agregar'}
          </button>
        </div>
      )}
    </article>
  );
}
