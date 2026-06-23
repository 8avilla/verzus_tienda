import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) return NextResponse.json([]);

  try {
    const db = await getDb();
    const reviews = await db
      .collection('reviews')
      .find({ productId, approved: true })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(
      reviews.map(r => ({
        id: r._id.toString(),
        authorName: r.authorName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }))
    );
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, authorName, rating, comment } = await req.json();

    if (!productId || !authorName?.trim() || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection('reviews').insertOne({
      productId,
      authorName: authorName.trim().slice(0, 80),
      rating: Math.round(rating),
      comment: (comment ?? '').trim().slice(0, 500),
      approved: true,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId.toString() }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 });
  }
}
