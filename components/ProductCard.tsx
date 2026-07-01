'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  delay?: number;
}

const COLOR_MAP: Record<string, string> = {
  negro: '#1a1a1a', blanco: '#f0f0f0', rojo: '#E8001C', azul: '#2563eb',
  verde: '#16a34a', amarillo: '#eab308', gris: '#9ca3af', cafe: '#92400e',
  café: '#92400e', rosado: '#ec4899', rosa: '#f472b6', naranja: '#f97316',
  morado: '#7c3aed', beige: '#d2b48c', crema: '#fef3c7', marino: '#1e3a5f',
  turquesa: '#0d9488', marfil: '#FFFFF0', terracota: '#E2725B', oliva: '#808000',
  camel: '#C19A6B', chocolate: '#7B3F00', lavanda: '#E6E6FA', coral: '#FF7F50',
  menta: '#98FF98', carbon: '#36454F', tinto: '#4A0E2E',
};

function getSwatchColor(opt: string): string {
  if (/^#[0-9a-fA-F]{3,8}$/.test(opt)) return opt;
  return COLOR_MAP[opt.toLowerCase()] ?? '#e5e7eb';
}

export default function ProductCard({ product, priority = false, delay = 0 }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);

  const images = product.images ?? [];
  const hasMultiple = images.length > 1;

  const colorGroup = (product.variantGroups ?? []).find(g =>
    g.name.toLowerCase().includes('color')
  );
  const swatches = colorGroup?.options.map(getSwatchColor).slice(0, 5) ?? [];

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
    e.preventDefault();
    e.stopPropagation();
    setImgIdx(i => (i - 1 + images.length) % images.length);
  }

  function next(e: React.MouseEvent) {
    e.preventDefault();
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

  return (
    <article
      ref={cardRef}
      style={{ animationDelay: `${delay}ms` }}
      className={`group flex flex-col h-full bg-white ${visible ? 'animate-fade-up' : 'opacity-0'}`}
    >
      {/* Imagen */}
      <Link
        href={`/producto/${product.id}`}
        className="block relative aspect-[3/4] overflow-hidden bg-gray-100 shrink-0 rounded-xl cursor-dot"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {images.length === 0 ? (
          <div className="w-full h-full bg-gray-100" />
        ) : (
          images.map((src, i) => {
            const showAlt = hovered && imgIdx === 0 && hasMultiple;
            const isVisible = showAlt ? i === 1 : i === imgIdx;
            return (
              <Image
                key={src}
                src={src}
                alt={i === 0 ? product.name : `${product.name} ${i + 1}`}
                fill
                className={`object-cover transition-opacity duration-500 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                sizes="(max-width: 1024px) 50vw, 33vw"
                priority={priority && i === 0}
                loading={priority && i === 0 ? undefined : 'lazy'}
              />
            );
          })
        )}

        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />

        {/* Badge AGOTADO */}
        {product.soldOut && (
          <div className="absolute top-2 left-2">
            <span className="text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full bg-black/60">
              Agotado
            </span>
          </div>
        )}

        {/* Corazón + badges stock */}
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

        {/* Flechas prev/next — solo desktop en hover */}
        {hasMultiple && (
          <>
            <button onClick={prev} aria-label="Imagen anterior"
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-sm text-sm font-medium">
              ‹
            </button>
            <button onClick={next} aria-label="Imagen siguiente"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/85 hover:bg-white flex items-center justify-center opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-sm text-sm font-medium">
              ›
            </button>
            {/* Dots — mobile */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 lg:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setImgIdx(i); }}
                  aria-label={`Ver imagen ${i + 1}`}
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    i === imgIdx ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </Link>

      {/* Info */}
      <Link href={`/producto/${product.id}`} className="flex flex-col gap-1.5 pt-3 px-0.5 pb-1 hover:opacity-80 transition-opacity">
        <h3
          className="text-sm text-black leading-snug line-clamp-2 font-normal"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          {product.name}
        </h3>
        {/* Precio: siempre visible en mobile, reveal en hover para desktop */}
        <div className="flex items-center gap-2 lg:opacity-0 lg:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <p className="text-[11px] font-normal text-gray-400 leading-none">
            ${product.price.toLocaleString('es-CO')} COP
          </p>
          {swatches.length > 0 && (
            <div className="hidden lg:flex gap-1">
              {swatches.map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-gray-200 shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
