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
  const cls = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <span className={cls} aria-label={`${rating} estrellas`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#F59E0B' : '#E5E7EB' }}>★</span>
      ))}
    </span>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Hace 1 día';
  if (days < 7) return `Hace ${days} días`;
  if (days < 14) return 'Hace 1 semana';
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
  if (days < 60) return 'Hace 1 mes';
  return `Hace ${Math.floor(days / 30)} meses`;
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
  const hue = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
      style={{ backgroundColor: `hsl(${hue},45%,45%)` }}
    >
      {initials}
    </div>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      setReviews(await res.json());
    } catch { setReviews([]); }
    finally { setLoaded(true); }
  }, [productId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    pct: count > 0 ? Math.round((reviews.filter(r => r.rating === star).length / count) * 100) : 0,
  }));

  return (
    <section className="border-t border-gray-100 py-12 px-4 sm:px-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-black">
          Reseñas {count > 0 && <span className="font-normal text-gray-500">({count})</span>}
        </h2>
        {count > 0 && (
          <button
            onClick={() => setShowForm(s => !s)}
            className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
          >
            Ver todas
          </button>
        )}
      </div>

      {/* Rating summary */}
      {count > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 mb-10 pb-10 border-b border-gray-100">
          {/* Score */}
          <div className="flex flex-col items-center justify-center gap-1 shrink-0 min-w-[120px]">
            <p className="text-6xl font-bold text-black leading-none">{avg.toFixed(1)}</p>
            <Stars rating={Math.round(avg)} size="lg" />
            <p className="text-[11px] text-gray-400 mt-1">Basado en {count} reseñas</p>
          </div>
          {/* Bars */}
          <div className="flex flex-col gap-2 flex-1">
            {distribution.map(({ star, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-4 shrink-0">{star}</span>
                <span style={{ color: '#F59E0B' }} className="text-xs leading-none">★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-8 text-right shrink-0">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews list */}
      {loaded && count === 0 && !showForm && (
        <p className="text-sm text-gray-400 text-center py-8">Sé el primero en dejar una reseña.</p>
      )}

      {count > 0 && (
        <ul className="flex flex-col divide-y divide-gray-100 mb-8">
          {reviews.map(r => (
            <li key={r.id} className="py-5">
              <div className="flex items-start gap-3">
                <Initials name={r.authorName} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                    <span className="text-sm font-semibold text-black">{r.authorName}</span>
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd"/>
                      </svg>
                      Verificado
                    </span>
                    <span className="ml-auto text-[10px] text-gray-400 shrink-0">{timeAgo(r.createdAt)}</span>
                  </div>
                  <Stars rating={r.rating} />
                  {r.comment && <p className="text-sm text-gray-600 leading-relaxed mt-2">{r.comment}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Form toggle */}
      {showForm ? (
        <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50/40">
          <p className="text-xs uppercase tracking-widest font-semibold text-black mb-4">Escribir una reseña</p>
          <ReviewForm productId={productId} onSubmitted={() => { fetchReviews(); setShowForm(false); }} />
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-4 border border-gray-200 hover:border-black text-sm font-semibold uppercase tracking-widest text-black rounded-xl transition-all duration-150 active:scale-[0.98]"
        >
          Escribir una reseña
        </button>
      )}
    </section>
  );
}
