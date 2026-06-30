import type { Metadata } from 'next';
import Link from 'next/link';
import { getDb } from '@/lib/mongodb';
import { Product, CategoryDoc } from '@/types';
import ProductGrid from '@/components/ProductGrid';

export const metadata: Metadata = {
  title: 'Colección completa — Verzus',
  description: 'Explora toda la colección Verzus. Camisetas, gorras y accesorios con diseños exclusivos. Envíos a toda Colombia.',
  alternates: { canonical: '/coleccion' },
};

export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db.collection('products')
      .find({ active: { $ne: false } })
      .sort({ position: 1, createdAt: -1 })
      .toArray();
    return docs.map(doc => {
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
        images: (doc.images as string[] | undefined) ?? [],
        variantGroups: (doc.variantGroups as Product['variantGroups']) ?? [],
        freeShipping: doc.freeShipping === true,
        soldOut: doc.soldOut === true,
        showPopup: doc.showPopup === true,
        popupImage: (doc.popupImage as string) ?? '',
        stock: (doc.stock as number | null) ?? null,
        stockTracked: doc.stockTracked === true,
        lastUnits: doc.lastUnits === true,
      };
    });
  } catch {
    return [];
  }
}

async function getCategories(): Promise<CategoryDoc[]> {
  try {
    const db = await getDb();
    const docs = await db.collection('categories').find({ active: { $ne: false } }).sort({ order: 1, name: 1 }).toArray();
    return docs.map(doc => ({
      id: doc._id.toString(),
      name: doc.name as string,
      slug: doc.slug as string,
      subtitle: (doc.subtitle as string) ?? '',
    }));
  } catch {
    return [];
  }
}

export default async function ColeccionPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [rawProducts, categories] = await Promise.all([getProducts(), getCategories()]);

  // Normalizar categorías de productos a nombres canónicos (slug → nombre)
  const catByKey: Record<string, CategoryDoc> = {};
  for (const c of categories) { catByKey[c.name] = c; catByKey[c.slug] = c; }
  const products = rawProducts.map(p => ({
    ...p,
    categories: p.categories.map(cat => catByKey[cat]?.name ?? cat),
    category: catByKey[p.category]?.name ?? p.category,
  }));

  const initialCategory = categoria && categories.some(c => c.name === categoria)
    ? categoria
    : 'todos';

  return (
    <main className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-10">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
          <span>/</span>
          {initialCategory !== 'todos' ? (
            <>
              <Link href="/coleccion" className="hover:text-black transition-colors">Colección</Link>
              <span>/</span>
              <span className="text-black">{initialCategory}</span>
            </>
          ) : (
            <span className="text-black">Colección</span>
          )}
        </nav>

        <ProductGrid
          products={products}
          categories={categories}
          initialCategory={initialCategory}
        />

      </div>
    </main>
  );
}
