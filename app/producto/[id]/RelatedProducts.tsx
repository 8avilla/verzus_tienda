import Image from 'next/image';
import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { Product } from '@/types';

const COLOR_MAP: Record<string, string> = {
  negro: '#1a1a1a', blanco: '#f0f0f0', rojo: '#E8001C', azul: '#2563eb',
  verde: '#16a34a', amarillo: '#eab308', gris: '#9ca3af', cafe: '#92400e',
  café: '#92400e', rosado: '#ec4899', rosa: '#f472b6', naranja: '#f97316',
  morado: '#7c3aed', beige: '#d2b48c', crema: '#fef3c7', marino: '#1e3a5f',
  turquesa: '#0d9488', marfil: '#FFFFF0', terracota: '#E2725B', oliva: '#808000',
  camel: '#C19A6B', chocolate: '#7B3F00', lavanda: '#E6E6FA', coral: '#FF7F50',
  menta: '#98FF98', carbon: '#36454F', tinto: '#4A0E2E',
};

function getSwatchColor(opt: string): string | null {
  if (/^#[0-9a-fA-F]{3,8}$/.test(opt)) return opt;
  return COLOR_MAP[opt.toLowerCase()] ?? null;
}

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db.collection('products')
      .find({ $or: [{ categories: category }, { category }], active: { $ne: false }, soldOut: { $ne: true } })
      .sort({ position: 1, createdAt: -1 })
      .limit(5)
      .toArray();
    return docs
      .filter(d => d._id.toString() !== excludeId)
      .slice(0, 4)
      .map(doc => {
        const cats: string[] = Array.isArray(doc.categories) && doc.categories.length > 0
          ? doc.categories as string[]
          : [(doc.category as string) ?? ''].filter(Boolean);
        return {
          id: doc._id.toString(),
          name: doc.name as string,
          category: cats[0] ?? '',
          categories: cats,
          price: doc.price as number,
          description: doc.description as string,
          images: (doc.images as string[]) ?? [],
          variantGroups: (doc.variantGroups as Product['variantGroups']) ?? [],
          freeShipping: doc.freeShipping === true,
          soldOut: false,
        };
      });
  } catch { return []; }
}

export default async function RelatedProducts({ category, excludeId }: { category: string; excludeId: string }) {
  const products = await getRelated(category, excludeId);
  if (products.length === 0) return null;

  return (
    <section className="border-t border-gray-100 py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">✦ Descubre más</p>
          <h2
            className="text-3xl text-black font-normal"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            También te puede gustar
          </h2>
        </div>
        <Link
          href={`/coleccion?categoria=${encodeURIComponent(category)}`}
          className="text-[10px] uppercase tracking-[0.18em] text-gray-400 hover:text-black transition-colors border-b border-gray-300 hover:border-black pb-px shrink-0"
        >
          Ver todas →
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
        {products.map(p => {
          const colorGroup = (p.variantGroups ?? []).find(g => g.name.toLowerCase().includes('color'));
          const swatches = colorGroup
            ? colorGroup.options.map(opt => getSwatchColor(opt)).filter(Boolean).slice(0, 4) as string[]
            : [];

          return (
            <Link key={p.id} href={`/producto/${p.id}`} className="group flex flex-col gap-2">
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                {p.images[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-opacity duration-500 ease-in-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {p.images[1] && (
                  <Image
                    src={p.images[1]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1.5 px-0.5">
                <p
                  className="text-sm text-black leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity font-normal"
                  style={{ fontFamily: 'var(--font-dm-serif)' }}
                >
                  {p.name}
                </p>
                <p className="text-[11px] font-normal text-gray-400">${p.price.toLocaleString('es-CO')} COP</p>
                {swatches.length > 0 && (
                  <div className="flex gap-1">
                    {swatches.map((c, i) => (
                      <div key={i} className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
