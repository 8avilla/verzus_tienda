import { getDb } from '@/lib/mongodb';
import { HomepageSection } from '@/types/homepage';

const DEFAULT_SECTIONS: HomepageSection[] = [
  { id: '1', type: 'hero',              enabled: true, config: {} },
  { id: '2', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
  { id: '3', type: 'image_banner',      enabled: true, config: { text: '', link: '' } },
  { id: '4', type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
  { id: '5', type: 'text_block',        enabled: true, config: { heading: '', body: '', bg: 'black' } },
];

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection('settings').findOne({ _id: 'main' as unknown as import('mongodb').ObjectId });
    const sections = doc?.homepageSections as HomepageSection[] | undefined;
    return Response.json(sections ?? DEFAULT_SECTIONS);
  } catch {
    return Response.json(DEFAULT_SECTIONS);
  }
}

export async function PUT(request: Request) {
  try {
    const db = await getDb();
    const sections = await request.json();
    await db.collection('settings').updateOne(
      { _id: 'main' as unknown as import('mongodb').ObjectId },
      { $set: { homepageSections: sections, updatedAt: new Date() } },
      { upsert: true }
    );
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Error guardando' }, { status: 500 });
  }
}
