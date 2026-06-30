import Image from 'next/image';
import { InstagramGridConfig } from '@/types/homepage';

export default function InstagramSection({ cfg }: { cfg: InstagramGridConfig }) {
  const handle = cfg.handle || '@verzus.wear';
  const images = (cfg.images ?? []).filter(Boolean).slice(0, 6);
  const profileUrl = `https://www.instagram.com/${handle.replace('@', '')}`;

  return (
    <section className="border-t border-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-black">En Instagram</h2>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            {handle}
          </a>
        </div>

        {/* Grid de fotos */}
        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {images.map((src, i) => (
              <a
                key={i}
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 block group"
              >
                <Image
                  src={src}
                  alt={`${handle} foto ${i + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 33vw, (max-width: 1280px) 20vw, 200px"
                  unoptimized={src.startsWith('http')}
                />
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-gray-100" />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-6 flex justify-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center border border-black text-black text-xs font-bold uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-black hover:text-white transition-all duration-200"
          >
            Ver más en Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
