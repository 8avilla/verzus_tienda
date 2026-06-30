import Image from 'next/image';
import Link from 'next/link';
import { LifestyleBannerConfig } from '@/types/homepage';

export default function LifestyleBanner({ cfg }: { cfg: LifestyleBannerConfig }) {
  const isDark = cfg.bg === 'dark';

  return (
    <section className={`py-12 px-4 sm:px-6 border-t border-gray-100 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* Texto */}
        <div className="flex flex-col gap-4 order-2 lg:order-1">
          {cfg.label && (
            <p className={`text-[10px] uppercase tracking-[0.25em] font-semibold ${isDark ? 'text-white/50' : 'text-gray-400'}`}>
              {cfg.label}
            </p>
          )}
          {cfg.heading && (
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold uppercase leading-tight tracking-tight ${isDark ? 'text-white' : 'text-black'}`}
              style={{ fontFamily: 'var(--font-dm-serif)' }}
            >
              {cfg.heading}
            </h2>
          )}
          {cfg.body && (
            <p className={`text-sm leading-relaxed max-w-sm ${isDark ? 'text-white/70' : 'text-gray-500'}`}>
              {cfg.body}
            </p>
          )}
          {cfg.cta && (
            <Link
              href={cfg.link || '/coleccion'}
              className={`self-start text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all active:scale-[0.97] ${
                isDark
                  ? 'bg-white text-black hover:bg-gray-100'
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {cfg.cta}
            </Link>
          )}
        </div>

        {/* Imágenes */}
        {cfg.images && cfg.images.length > 0 && (
          <div className={`order-1 lg:order-2 grid gap-3 ${cfg.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {cfg.images.slice(0, 2).map((src, i) => (
              <div key={i} className={`relative overflow-hidden rounded-xl bg-gray-200 ${cfg.images!.length === 1 ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
                <Image
                  src={src}
                  alt={cfg.heading || `Verzus lifestyle ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  unoptimized={src.startsWith('http')}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
