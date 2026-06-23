'use client';

import { useState, useEffect, useCallback } from 'react';
import ReviewForm from './ReviewForm';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function Stars({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <span className={cls} aria-label={`${rating} estrellas`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#F59E0B' : '#E5E7EB' }}>★</span>
      ))}
    </span>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoaded(true);
    }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const avg = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return (
    <section className="border-t border-gray-100 py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold mb-1">
              Reseñas del producto
            </p>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2">
                <Stars rating={Math.round(avg)} size="lg" />
                <span className="text-sm text-gray-500">
                  {avg.toFixed(1)} · {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}
                </span>
              </div>
            )}
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="text-xs uppercase tracking-widest border border-black text-black px-5 py-2.5 rounded-full hover:bg-black hover:text-white transition-all duration-150 active:scale-[0.97]"
            >
              Escribir reseña
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 border border-gray-100 rounded-xl p-5 bg-gray-50/40">
            <h3 className="text-xs uppercase tracking-widest text-black font-semibold mb-4">Tu reseña</h3>
            <ReviewForm
              productId={productId}
              onSubmitted={() => {
                fetchReviews();
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Reviews list */}
        {loaded && reviews.length === 0 && !showForm && (
          <p className="text-sm text-gray-400 text-center py-8">
            Sé el primero en dejar una reseña de este producto.
          </p>
        )}

        {reviews.length > 0 && (
          <ul className="flex flex-col divide-y divide-gray-100">
            {reviews.map(r => (
              <li key={r.id} className="py-5">
                <div className="flex items-center gap-3 mb-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs font-semibold text-black">{r.authorName}</span>
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {new Date(r.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}

      </div>
    </section>
  );
}
