import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get('category') ?? '';
  const excludeRaw = req.nextUrl.searchParams.get('exclude') ?? '';
  const exclude = excludeRaw ? excludeRaw.split(',') : [];

  try {
    const db = await getDb();
    const query: Record<string, unknown> = {
      active: { $ne: false },
      soldOut: { $ne: true },
    };
    if (category) query.category = category;

    const docs = await db.collection('products')
      .find(query)
      .project({ _id: 1, name: 1, category: 1, price: 1, images: 1 })
      .limit(10)
      .toArray();

    const filtered = docs
      .filter(d => !exclude.includes(d._id.toString()))
      .slice(0, 3);

    return NextResponse.json(
      filtered.map(d => ({
        id: d._id.toString(),
        name: d.name,
        category: d.category,
        price: d.price,
        image: (d.images as string[])?.[0] ?? null,
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
