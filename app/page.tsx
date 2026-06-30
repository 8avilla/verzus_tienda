import type { Metadata } from 'next';
import { getDb } from '@/lib/mongodb';
import { Product, CategoryDoc } from '@/types';
import { HomepageSection } from '@/types/homepage';
import HomepageRenderer from '@/components/HomepageRenderer';
import FAQ from '@/components/FAQ';
import SizeGuide from '@/components/SizeGuide';
import PageviewTracker from '@/components/PageviewTracker';

export const metadata: Metadata = {
  title: 'Verzus — Ropa para gente como tú',
  description: 'Verzus es una marca colombiana de ropa con diseños exclusivos. Camisetas, gorras y accesorios que dicen quién eres. Envíos a toda Colombia.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Verzus — Ropa para gente como tú',
    description: 'Marca colombiana con diseños exclusivos. Camisetas, gorras y accesorios. Envíos a toda Colombia.',
    url: '/',
  },
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

async function getHomepageSections(): Promise<HomepageSection[] | null> {
  try {
    const db = await getDb();
    const doc = await db.collection('settings').findOne({ _id: 'main' as unknown as import('mongodb').ObjectId });
    return (doc?.homepageSections as HomepageSection[]) ?? null;
  } catch {
    return null;
  }
}

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: '1', type: 'hero',              enabled: true, config: {} },
  { id: '2', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
  { id: '3', type: 'image_banner',      enabled: true, config: {} },
  { id: '4', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
  { id: '5', type: 'text_block',        enabled: true, config: { heading: '', body: '', bg: 'black' } },
];

export default async function Home() {
  const [products, categories, savedSections] = await Promise.all([
    getProducts(),
    getCategories(),
    getHomepageSections(),
  ]);

  const sections = savedSections ?? DEFAULT_SECTIONS;

  // Índice de categorías por nombre Y slug
  const categoryMeta: Record<string, CategoryDoc> = {};
  for (const c of categories) {
    categoryMeta[c.name] = c;
    categoryMeta[c.slug] = c;
  }

  // Normalizar categorías de productos a nombre canónico
  const normalizedProducts = products.map(p => ({
    ...p,
    categories: p.categories.map(cat => categoryMeta[cat]?.name ?? cat),
    category: categoryMeta[p.category]?.name ?? p.category,
  }));

  return (
    <main className="flex-1 w-full">
      <PageviewTracker />

      <div id="catalogo">
        <HomepageRenderer
          sections={sections}
          allProducts={normalizedProducts}
          categoryMeta={categoryMeta}
        />
      </div>

      <SizeGuide />
      <FAQ />

      <section id="contacto" className="border-t border-gray-100 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center shrink-0">
              <span className="text-[10px] font-black tracking-tighter text-black">VZ</span>
            </div>
            <div>
              <p className="text-sm text-black italic" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                Verzus
              </p>
              <p className="text-[10px] uppercase tracking-widest text-black font-semibold">
                Ropa para gente como tú
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-2">
            <div className="flex gap-4">
              <a href="/politicas" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Políticas</a>
              <a href="/terminos" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Términos</a>
            </div>
            <a href="/admin" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-black transition-colors">Administración</a>
          </div>
        </div>
      </section>
    </main>
  );
}
