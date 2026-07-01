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
  videoUrl,
}: {
  images: string[];
  name: string;
  freeShipping?: boolean;
  activeIndex?: number;
  onActiveIndexChange?: (i: number) => void;
  videoUrl?: string;
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

  // slot 0 = video (if any), slots 1..n = images
  const hasVideo = !!videoUrl;
  const totalSlots = images.length + (hasVideo ? 1 : 0);
  const isVideoSlot = (i: number) => hasVideo && i === 0;
  const imageIndex = (i: number) => hasVideo ? i - 1 : i;

  const ThumbnailButton = ({ i }: { i: number }) => {
    const active = i === current;
    return (
      <button
        onClick={() => setCurrent(i)}
        aria-label={isVideoSlot(i) ? 'Ver video' : `Ver imagen ${imageIndex(i) + 1}`}
        className={`relative flex-shrink-0 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 transition-all duration-200 ${
          active ? 'ring-1 ring-black ring-offset-1' : 'opacity-40 hover:opacity-75'
        }`}
      >
        {isVideoSlot(i) ? (
          <>
            <video src={videoUrl} muted className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </>
        ) : (
          <Image
            src={images[imageIndex(i)]}
            alt={`${name} — miniatura ${imageIndex(i) + 1}`}
            fill
            sizes="80px"
            className="object-cover"
          />
        )}
      </button>
    );
  };

  return (
    /* Desktop: thumbnails left + main image. Mobile: main top + thumbnails row below */
    <div className="flex flex-col gap-3 lg:grid lg:gap-3" style={{ gridTemplateColumns: images.length > 1 ? '72px 1fr' : '1fr' }}>

      {/* Vertical thumbnails — desktop left column */}
      {images.length > 1 && (
        <div className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-[640px] scrollbar-none">
          {Array.from({ length: totalSlots }, (_, i) => (
            <ThumbnailButton key={i} i={i} />
          ))}
        </div>
      )}

      {/* Main image / video */}
      <div
        ref={imgContainerRef}
        className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 select-none cursor-dot"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseMove={!isVideoSlot(current) ? handleMouseMove : undefined}
        onMouseLeave={() => setZoom(null)}
      >
        {/* Video slot */}
        {hasVideo && (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: current === 0 ? 1 : 0, transition: 'opacity 0.25s ease' }}
          />
        )}

        {/* Image slots */}
        {images.map((src, imgI) => {
          const slot = hasVideo ? imgI + 1 : imgI;
          return (
            <Image
              key={src}
              src={src}
              alt={`${name} — imagen ${imgI + 1}`}
              fill
              priority={imgI < 2}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              style={{
                opacity: slot === current ? 1 : 0,
                transition: slot === current
                  ? 'opacity 0.25s ease, transform 0.15s ease-out'
                  : 'opacity 0.2s ease',
                ...(!isVideoSlot(current) && slot === current && zoom ? {
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                  transform: 'scale(2.2)',
                } : { transform: 'scale(1)' }),
              }}
            />
          );
        })}

        {freeShipping && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full shadow">
            Envío gratis
          </div>
        )}

        {totalSlots > 1 && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {current + 1}/{totalSlots}
          </div>
        )}

        {!isVideoSlot(current) && (
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
        )}

        {totalSlots > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Imagen anterior"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center text-lg font-medium transition-colors lg:hidden"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Imagen siguiente"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 hover:bg-white shadow flex items-center justify-center text-lg font-medium transition-colors lg:hidden"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Horizontal thumbnails — mobile only */}
      {totalSlots > 1 && (
        <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-none pb-0.5">
          {Array.from({ length: totalSlots }, (_, i) => (
            <div key={i} className="w-[64px] flex-shrink-0">
              <ThumbnailButton i={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
