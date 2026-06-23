import Image from 'next/image';
import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { Product } from '@/types';

async function getRelated(category: string, excludeId: string): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db.collection('products')
      .find({ category, active: { $ne: false }, soldOut: { $ne: true } })
      .sort({ position: 1, createdAt: -1 })
      .limit(5)
      .toArray();
    return docs
      .filter(d => d._id.toString() !== excludeId)
      .slice(0, 4)
      .map(doc => ({
        id: doc._id.toString(),
        name: doc.name as string,
        category: doc.category as string,
        price: doc.price as number,
        description: doc.description as string,
        images: (doc.images as string[]) ?? [],
        variantGroups: (doc.variantGroups as Product['variantGroups']) ?? [],
        freeShipping: doc.freeShipping === true,
        soldOut: false,
      }));
  } catch {
    return [];
  }
}

export default async function RelatedProducts({ category, excludeId }: { category: string; excludeId: string }) {
  const products = await getRelated(category, excludeId);
  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-t border-gray-100">
      <h2 className="text-2xl sm:text-3xl text-black mb-8" style={{ fontFamily: 'var(--font-dm-serif)' }}>
        También te puede gustar
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map(p => (
          <Link
            key={p.id}
            href={`/producto/${p.id}`}
            className="group flex flex-col gap-2"
          >
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
              {p.images[0] ? (
                <Image
                  src={p.images[0]}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
              ) : (
                <div className="w-full h-full bg-gray-100" />
              )}
            </div>
            <div className="flex flex-col gap-0.5 px-1">
              <p className="text-xs font-medium text-black leading-snug line-clamp-2 group-hover:opacity-70 transition-opacity">
                {p.name}
              </p>
              <p className="text-sm font-bold text-black" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                ${p.price.toLocaleString('es-CO')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
