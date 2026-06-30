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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-black">Te pueden gustar</h2>
        <Link
          href={`/coleccion?categoria=${encodeURIComponent(category)}`}
          className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
        >
          Ver todas
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {/* Heart icon */}
                <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-1 px-0.5">
                <p className="text-xs font-semibold uppercase tracking-tight text-black leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity">
                  {p.name}
                </p>
                <p className="text-sm font-bold text-black">${p.price.toLocaleString('es-CO')} COP</p>
                {swatches.length > 0 && (
                  <div className="flex gap-1 mt-0.5">
                    {swatches.map((c, i) => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
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
