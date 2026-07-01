import { TestimonialsConfig } from '@/types/homepage';

function Stars({ n }: { n: number }) {
  return (
    <span aria-label={`${n} estrellas`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? '#F59E0B' : '#E5E7EB' }} className="text-sm leading-none">★</span>
      ))}
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: `hsl(${hue},45%,45%)` }}
    >
      {initials}
    </div>
  );
}

export default function TestimonialsSection({ cfg }: { cfg: TestimonialsConfig }) {
  const items = cfg.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        <div className="text-center flex flex-col gap-2">
          {cfg.label && (
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">
              {cfg.label}
            </p>
          )}
          {cfg.heading && (
            <h2
              className="text-2xl sm:text-3xl text-black leading-tight"
              style={{ fontFamily: 'var(--font-dm-serif)', fontStyle: 'italic' }}
            >
              {cfg.heading}
            </h2>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <article key={i} className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100">
              <Stars n={t.rating ?? 5} />
              <p className="text-sm text-gray-700 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <Initials name={t.name} />
                <div>
                  <p className="text-xs font-semibold text-black">{t.name}</p>
                  {t.location && <p className="text-[10px] text-gray-400">{t.location}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
