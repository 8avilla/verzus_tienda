'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HeroSlide } from '@/types/homepage';

const DEFAULT_SLIDE: HeroSlide = {
  image: '/images/imagen_portada.png',
  eyebrow: 'Nueva colección',
  headingLine1: 'Diseñado para moverte.',
  headingLine2: 'Hecho para acompañarte.',
  body: 'Activewear premium que combina rendimiento, elegancia y estilo para tu vida activa.',
  cta: 'Descubrir colección',
};

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides = [DEFAULT_SLIDE] }: HeroProps) {
  const items = slides.length > 0 ? slides : [DEFAULT_SLIDE];
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setTimeout(() => setCurrent(i => (i + 1) % items.length), 5000);
    return () => clearTimeout(id);
  }, [current, items.length]);

  function scrollToCatalog() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || items.length <= 1) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 40) return;
    setCurrent(i => delta > 0 ? (i + 1) % items.length : (i - 1 + items.length) % items.length);
    touchStartX.current = null;
  }

  const active = items[current];

  return (
    <section
      className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/8] lg:min-h-[560px] overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Imágenes — crossfade entre slides */}
      {items.map((slide, i) => (
        <Image
          key={i}
          src={slide.image || DEFAULT_SLIDE.image!}
          alt={slide.headingLine1 || 'Verzus'}
          fill
          className={`object-cover object-center transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="100vw"
          priority={i === 0}
          unoptimized={(slide.image || '').startsWith('http')}
        />
      ))}

      {/* Overlay para legibilidad del texto */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      {/* Texto — mismo layout en mobile y desktop */}
      <div className="absolute inset-0 flex flex-col justify-center items-start text-left text-white px-6 sm:px-10 lg:px-16 gap-3 lg:gap-5 max-w-md lg:max-w-xl">
        {active.eyebrow && (
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/80">
            ✦ {active.eyebrow}
          </p>
        )}
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl uppercase leading-[1.05] tracking-tight"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          {active.headingLine1 && <span className="block">{active.headingLine1}</span>}
          {active.headingLine2 && <span className="block">{active.headingLine2}</span>}
        </h1>
        {active.body && <span className="w-8 h-px bg-white/60" />}
        {active.body && (
          <p className="text-xs sm:text-sm text-white/85 max-w-xs lg:max-w-sm leading-relaxed">
            {active.body}
          </p>
        )}
        {active.cta && (
          <button
            onClick={scrollToCatalog}
            className="mt-1 bg-white text-black text-[11px] sm:text-xs font-semibold uppercase tracking-widest px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-lg hover:bg-gray-100 active:scale-95 transition-all w-fit"
          >
            {active.cta}
          </button>
        )}
      </div>

      {/* Indicadores — puntos en mobile */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex lg:hidden gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Indicadores — numerados verticales en desktop */}
      {items.length > 1 && (
        <div className="hidden lg:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Ir al slide ${i + 1}`}
              className="flex flex-col items-center gap-2"
            >
              {i === current && <span className="w-4 h-px bg-white" />}
              <span className={`text-[11px] tracking-widest transition-colors ${
                i === current ? 'text-white font-semibold' : 'text-white/50'
              }`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
