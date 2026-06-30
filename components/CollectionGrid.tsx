import Image from 'next/image';
import Link from 'next/link';
import { CollectionGridItem } from '@/types/homepage';

interface Props {
  items: CollectionGridItem[];
}

export default function CollectionGrid({ items }: Props) {
  const shown = items.filter(i => i.image || i.title);
  if (shown.length === 0) return null;

  return (
    <section className="border-t border-gray-100 py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {shown.map((item, i) => (
            <Link
              key={i}
              href={item.link || '/coleccion'}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 block"
            >
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  unoptimized={item.image.startsWith('http')}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-5 text-white">
                <h3
                  className="text-lg sm:text-xl leading-tight mb-1"
                  style={{ fontFamily: 'var(--font-dm-serif)' }}
                >
                  {item.title}
                </h3>
                <span className="text-[10px] uppercase tracking-widest font-semibold inline-flex items-center gap-1">
                  Ver más
                  <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
