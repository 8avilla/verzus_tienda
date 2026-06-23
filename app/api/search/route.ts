import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json([]);

  try {
    const db = await getDb();
    const regex = new RegExp(q, 'i');
    const docs = await db.collection('products')
      .find({
        active: { $ne: false },
        $or: [{ name: regex }, { category: regex }, { description: regex }],
      })
      .project({ _id: 1, name: 1, category: 1, price: 1, images: 1, soldOut: 1 })
      .limit(8)
      .toArray();

    return NextResponse.json(
      docs.map(d => ({
        id: d._id.toString(),
        name: d.name,
        category: d.category,
        price: d.price,
        image: (d.images as string[])?.[0] ?? null,
        soldOut: d.soldOut === true,
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}
