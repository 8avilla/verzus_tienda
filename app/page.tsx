import type { Metadata } from 'next';
import { getDb } from '@/lib/mongodb';
import { Product, CategoryDoc } from '@/types';
import { HomepageSection } from '@/types/homepage';
import HomepageRenderer from '@/components/HomepageRenderer';
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
        tagline: (doc.tagline as string | undefined) ?? '',
        featured: doc.featured === true,
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
  { id: '1', type: 'hero', enabled: true, config: {
    image: '/images/imagen_portada.png',
    headingLine1: 'Diseñado para moverte.',
    headingLine2: 'Hecho para acompañarte.',
    body: 'Activewear premium con identidad propia.',
    cta: 'Descubrir colección',
  }},
  { id: '2', type: 'collection_grid', enabled: true, config: { items: [
    { title: 'Tennis', subtitle: 'Diseñada para jugar.', link: '/coleccion?categoria=Tennis' },
    { title: 'Training', subtitle: 'Para tu mejor versión.', link: '/coleccion?categoria=Training' },
    { title: 'Lifestyle', subtitle: 'Comodidad sin límites.', link: '/coleccion?categoria=Lifestyle' },
    { title: 'Sets', subtitle: 'El look completo.', link: '/coleccion?categoria=Sets' },
  ]}},
  { id: '3', type: 'lifestyle_banner', enabled: true, config: {
    label: 'Nueva temporada',
    heading: 'Para tu entrenamiento. Para tu día.',
    body: 'Piezas que se adaptan a tu ritmo, desde la primera repetición hasta el after.',
    cta: 'Explorar colección',
    link: '/coleccion',
    bg: 'light',
    images: [],
  }},
  { id: '4', type: 'featured_products', enabled: true, config: { useFeatured: true, productIds: [], title: 'Destacados' }},
  { id: '5', type: 'text_block', enabled: true, config: {
    heading: 'Ingeniería textil al servicio del movimiento.',
    body: 'Cada pieza Verzus está fabricada con telas de alto desempeño que respiran, se mueven contigo y mantienen su forma lavado tras lavado.',
    bg: 'black',
  }},
  { id: '6', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 }},
  { id: '7', type: 'lifestyle_banner', enabled: true, config: {
    label: 'Verzus Lifestyle',
    heading: 'Vista la confianza.',
    body: 'Más que activewear: es una actitud. Diseñado para quienes no se detienen.',
    cta: 'Ver colección',
    link: '/coleccion',
    bg: 'dark',
    images: [],
  }},
  { id: '8', type: 'instagram_grid', enabled: true, config: { handle: '@verzus.wear', images: [] }},
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

    </main>
  );
}
