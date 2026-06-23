import { getDb } from '@/lib/mongodb';
import { HomepageSection } from '@/types/homepage';
import { CategoryDoc, Product } from '@/types';
import HomepageBuilder from '@/components/admin/HomepageBuilder';

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: '1', type: 'hero',              enabled: true, config: {} },
  { id: '2', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
  { id: '3', type: 'image_banner',      enabled: true, config: { text: '', link: '' } },
  { id: '4', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
  { id: '5', type: 'text_block',        enabled: true, config: { heading: '', body: '', bg: 'black' } },
];

async function getSections(): Promise<HomepageSection[]> {
  try {
    const db = await getDb();
    const doc = await db.collection('settings').findOne({ _id: 'main' as unknown as import('mongodb').ObjectId });
    return (doc?.homepageSections as HomepageSection[]) ?? DEFAULT_SECTIONS;
  } catch {
    return DEFAULT_SECTIONS;
  }
}

async function getCategories(): Promise<CategoryDoc[]> {
  try {
    const db = await getDb();
    const docs = await db.collection('categories').find({}).sort({ order: 1, name: 1 }).toArray();
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
        description: (doc.description as string) ?? '',
        images: (doc.images as string[] | undefined) ?? [],
        variantGroups: (doc.variantGroups as Product['variantGroups']) ?? [],
        freeShipping: doc.freeShipping === true,
        soldOut: doc.soldOut === true,
      };
    });
  } catch {
    return [];
  }
}

export default async function HomepagePage() {
  const [sections, categories, products] = await Promise.all([
    getSections(),
    getCategories(),
    getProducts(),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-serif italic text-black">Portada</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Organiza las secciones de la página de inicio — arrastra para reordenar, activa o desactiva con el toggle
        </p>
      </div>

      <HomepageBuilder
        initial={sections}
        categories={categories}
        products={products}
      />
    </div>
  );
}
