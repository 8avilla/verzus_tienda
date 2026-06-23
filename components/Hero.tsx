'use client';
import Image from 'next/image';

const CHIPS = [
  'Ropa para gente como tú',
  'Diseños exclusivos',
  'Envíos a Colombia',
  'Pago seguro en línea',
];

export default function Hero({ heroImage = '/images/portada.jpeg' }: { heroImage?: string }) {
  function scrollToCatalog() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section>

      {/* ── MOBILE: imagen full-width con overlay ── */}
      <div className="relative w-full aspect-[16/9] lg:hidden">
        <Image
          src={heroImage}
          alt="Verzus colección"
          fill
          className="object-cover object-center"
          priority
          unoptimized={heroImage.startsWith('http')}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Texto centrado */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center gap-1.5 px-4">
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold text-white/80">
            ✦ Nueva colección
          </p>
          <h1
            className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Verzus
          </h1>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 mt-1">
            2025
          </p>
        </div>

        {/* CTA visible */}
        <button
          onClick={scrollToCatalog}
          className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white text-black text-[11px] font-semibold uppercase tracking-widest px-6 py-2.5 rounded-full shadow-lg hover:bg-gray-100 active:scale-95 transition-all"
        >
          Ver colección →
        </button>
      </div>

      {/* ── DESKTOP: layout 2 columnas ── */}
      <div className="hidden lg:grid max-w-7xl mx-auto px-6 py-20 grid-cols-2 gap-16 items-stretch">

        {/* Columna texto */}
        <div className="flex flex-col gap-6">
          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-black font-semibold">
            <span className="text-base leading-none">✦</span>
            Nueva colección
          </p>

          <h1
            className="text-6xl lg:text-7xl leading-[1.02] tracking-tight"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            <span className="text-black block">Ropa hecha</span>
            <span className="italic block" style={{ color: 'var(--accent)' }}>para ti.</span>
          </h1>

          <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
            Verzus es una marca de ropa para gente como tú. Camisetas, gorras y accesorios
            con diseños exclusivos que dicen quién eres sin decir nada.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={scrollToCatalog}
              className="text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
              style={{ backgroundColor: 'var(--accent)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
            >
              Ver colección →
            </button>
          </div>

          <p
            className="text-xs text-gray-400"
            style={{ fontFamily: 'var(--font-dm-serif)', fontStyle: 'italic' }}
          >
            Pago seguro en línea · Envíos a toda Colombia
          </p>

          <div className="grid grid-cols-2 gap-2">
            {CHIPS.map((chip) => (
              <div
                key={chip}
                className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 text-xs text-gray-600"
              >
                <span className="text-black font-bold leading-none">·</span>
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* Columna imagen */}
        <div className="relative w-full rounded-2xl overflow-hidden">
          <Image
            src={heroImage}
            alt="Verzus"
            fill
            className="object-cover object-center"
            priority
            unoptimized={heroImage.startsWith('http')}
          />
        </div>

      </div>
    </section>
  );
}
