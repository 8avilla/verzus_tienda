'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { HeroSlide, HeroTextAlign, HeroTextVertical, HeroHeadingSize } from '@/types/homepage';

const DEFAULT_SLIDE: HeroSlide = {
  image: '/images/imagen_portada.png',
  eyebrow: 'Nueva colección',
  headingLine1: 'Diseñado para moverte.',
  headingLine2: 'Hecho para acompañarte.',
  body: 'Activewear premium que combina rendimiento, elegancia y estilo para tu vida activa.',
  cta: 'Descubrir colección',
  textAlign: 'left',
  textVertical: 'middle',
  headingSize: 'lg',
  mobileTextAlign: 'left',
  mobileTextVertical: 'middle',
  mobileHeadingSize: 'md',
};

// CSS values for each option
const ALIGN_CSS: Record<HeroTextAlign, string> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};
const TEXT_ALIGN_CSS: Record<HeroTextAlign, string> = {
  left: 'left',
  center: 'center',
  right: 'right',
};
const JUSTIFY_CSS: Record<HeroTextVertical, string> = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};
const VERTICAL_PADDING: Record<HeroTextVertical, { pt: string; pb: string }> = {
  top:    { pt: '4rem',  pb: '0px' },
  middle: { pt: '0px',   pb: '0px' },
  bottom: { pt: '0px',   pb: '4rem' },
};
// font-size in rem: [mobile, desktop]
const SIZE_REM: Record<HeroHeadingSize, [string, string]> = {
  xs:  ['1.25rem', '2rem'],
  sm:  ['1.625rem', '2.5rem'],
  md:  ['2rem',    '3.25rem'],
  lg:  ['2.5rem',  '4rem'],
  xl:  ['3rem',    '5rem'],
  '2xl': ['3.5rem', '6rem'],
};
// Gradient overlay based on alignment
const OVERLAY_GRAD: Record<HeroTextAlign, string> = {
  left:   'to right',
  center: 'to bottom',
  right:  'to left',
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

  // Layout config
  const mAlign   = active.mobileTextAlign  ?? DEFAULT_SLIDE.mobileTextAlign!;
  const dAlign   = active.textAlign        ?? DEFAULT_SLIDE.textAlign!;
  const mVertical = active.mobileTextVertical ?? DEFAULT_SLIDE.mobileTextVertical!;
  const dVertical = active.textVertical       ?? DEFAULT_SLIDE.textVertical!;
  const mSize    = active.mobileHeadingSize ?? DEFAULT_SLIDE.mobileHeadingSize!;
  const dSize    = active.headingSize       ?? DEFAULT_SLIDE.headingSize!;

  const [mFontSize, dFontSize] = SIZE_REM[mSize] ?? SIZE_REM.lg;
  const mPad = VERTICAL_PADDING[mVertical];
  const dPad = VERTICAL_PADDING[dVertical];

  // Overlay gradient (adapts to desktop alignment)
  const overlayDir = OVERLAY_GRAD[dAlign];

  function scrollToCatalog() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section
      className="relative w-full aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/8] lg:min-h-[560px] overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Images: mobile ── */}
      {items.map((slide, i) => (
        <Image
          key={`mob-${i}`}
          src={slide.mobileImage || slide.image || DEFAULT_SLIDE.image!}
          alt={slide.headingLine1 || 'Verzus'}
          fill
          className={`block lg:hidden object-cover object-center transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="100vw"
          priority={i === 0}
          unoptimized={!!(slide.mobileImage || slide.image || '').startsWith('http')}
        />
      ))}

      {/* ── Images: desktop ── */}
      {items.map((slide, i) => (
        <Image
          key={`desk-${i}`}
          src={slide.image || DEFAULT_SLIDE.image!}
          alt={slide.headingLine1 || 'Verzus'}
          fill
          className={`hidden lg:block object-cover object-center transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="100vw"
          priority={i === 0}
          unoptimized={!!(slide.image || '').startsWith('http')}
        />
      ))}

      {/* ── Overlay gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(${overlayDir}, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.05) 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      {/* ── Text container — uses CSS vars for responsive layout ── */}
      <div
        className="absolute inset-0 flex flex-col text-white px-6 sm:px-10 lg:px-16 gap-3 lg:gap-5
          [align-items:var(--m-align)] [justify-content:var(--m-justify)]
          [padding-top:var(--m-pt)] [padding-bottom:var(--m-pb)]
          lg:[align-items:var(--d-align)] lg:[justify-content:var(--d-justify)]
          lg:[padding-top:var(--d-pt)] lg:[padding-bottom:var(--d-pb)]"
        style={{
          '--m-align':   ALIGN_CSS[mAlign],
          '--d-align':   ALIGN_CSS[dAlign],
          '--m-justify': JUSTIFY_CSS[mVertical],
          '--d-justify': JUSTIFY_CSS[dVertical],
          '--m-pt': mPad.pt, '--m-pb': mPad.pb,
          '--d-pt': dPad.pt, '--d-pb': dPad.pb,
          textAlign: TEXT_ALIGN_CSS[mAlign] as 'left' | 'center' | 'right',
        } as React.CSSProperties}
      >
        {/* Override text-align on desktop via inline style on a wrapper */}
        <div
          className="flex flex-col gap-3 lg:gap-5 w-full max-w-[min(90%,38rem)] lg:max-w-[min(55%,52rem)]"
          style={{
            textAlign: undefined, // inherited from parent on mobile
          }}
        >
          <div
            style={{
              textAlign: TEXT_ALIGN_CSS[dAlign] as 'left' | 'center' | 'right',
            }}
            className="flex flex-col gap-3 lg:gap-5"
          >
            {/* Use a wrapper that overrides text-align for desktop via style */}
            <InnerText
              slide={active}
              mFontSize={mFontSize}
              dFontSize={dFontSize}
              mAlign={mAlign}
              dAlign={dAlign}
              onCta={scrollToCatalog}
            />
          </div>
        </div>
      </div>

      {/* ── Dots (mobile) ── */}
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

      {/* ── Numbers (desktop) ── */}
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

// Separate component so the desktop text-align override from the style prop
// doesn't interfere with the mobile layout
function InnerText({
  slide,
  mFontSize,
  dFontSize,
  mAlign,
  dAlign,
  onCta,
}: {
  slide: HeroSlide;
  mFontSize: string;
  dFontSize: string;
  mAlign: HeroTextAlign;
  dAlign: HeroTextAlign;
  onCta: () => void;
}) {
  return (
    <>
      {slide.eyebrow && (
        <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/80">
          ✦ {slide.eyebrow}
        </p>
      )}
      <h1
        className="uppercase leading-[1.05] tracking-tight lg:[font-size:var(--d-size)]"
        style={{
          fontSize: mFontSize,
          fontFamily: 'var(--font-dm-serif)',
          '--d-size': dFontSize,
        } as React.CSSProperties}
      >
        {slide.headingLine1 && <span className="block">{slide.headingLine1}</span>}
        {slide.headingLine2 && <span className="block">{slide.headingLine2}</span>}
      </h1>
      {slide.body && <span className={`w-8 h-px bg-white/60 ${mAlign === 'center' ? 'self-center' : mAlign === 'right' ? 'self-end' : 'self-start'} lg:${dAlign === 'center' ? 'self-center' : dAlign === 'right' ? 'self-end' : 'self-start'}`} />}
      {slide.body && (
        <p className="text-xs sm:text-sm text-white/85 max-w-xs lg:max-w-sm leading-relaxed">
          {slide.body}
        </p>
      )}
      {slide.cta && (
        <button
          onClick={onCta}
          className="mt-1 bg-white text-black text-[11px] sm:text-xs font-semibold uppercase tracking-widest px-6 sm:px-7 py-2.5 sm:py-3 rounded-full shadow-lg hover:bg-gray-100 active:scale-95 transition-all w-fit"
        >
          {slide.cta}
        </button>
      )}
    </>
  );
}
