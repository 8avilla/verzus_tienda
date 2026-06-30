'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

type ZoomPos = { x: number; y: number } | null;

export default function ProductGallery({
  images,
  name,
  freeShipping,
  activeIndex,
  onActiveIndexChange,
}: {
  images: string[];
  name: string;
  freeShipping?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (i: number) => void;
}) {
  const [internalCurrent, setInternalCurrent] = useState(0);
  const current = activeIndex !== undefined ? activeIndex : internalCurrent;
  const touchStartX = useRef<number | null>(null);
  const [zoom, setZoom] = useState<ZoomPos>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  function setCurrent(i: number) {
    setZoom(null);
    if (onActiveIndexChange) onActiveIndexChange(i);
    else setInternalCurrent(i);
  }

  function prev() { setCurrent((current - 1 + images.length) % images.length); }
  function next() { setCurrent((current + 1) % images.length); }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  if (!images.length) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-sm">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Imagen principal */}
      <div
        ref={imgContainerRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 select-none lg:cursor-crosshair"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoom(null)}
      >
        {/* Todas las imágenes apiladas — sin key dinámico, sin remount */}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${name} — imagen ${i + 1}`}
            fill
            priority={i < 2}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{
              opacity: i === current ? 1 : 0,
              transition: i === current
                ? 'opacity 0.25s ease, transform 0.15s ease-out'
                : 'opacity 0.2s ease',
              ...(i === current && zoom ? {
                transformOrigin: `${zoom.x}% ${zoom.y}%`,
                transform: 'scale(2.2)',
              } : {
                transform: 'scale(1)',
              }),
            }}
          />
        ))}

        {freeShipping && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow">
            Envío gratis
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {current + 1}/{images.length}
          </div>
        )}

        {/* Zoom icon */}
        <button
          type="button"
          aria-label="Ampliar imagen"
          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center transition-colors"
          onClick={() => setZoom(zoom ? null : { x: 50, y: 50 })}
        >
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center text-lg font-medium transition-colors"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center text-lg font-medium transition-colors"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Miniaturas — scroll horizontal */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setCurrent(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={`relative flex-shrink-0 w-[72px] aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 transition-all duration-150 ${
                i === current ? 'ring-2 ring-black ring-offset-1' : 'opacity-55 hover:opacity-90'
              }`}
            >
              <Image
                src={img}
                alt={`${name} — miniatura ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
