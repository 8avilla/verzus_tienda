'use client';

import { useState } from 'react';

export default function ReviewForm({ productId, onSubmitted }: { productId: string; onSubmitted: () => void }) {
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || rating === 0) return;
    setLoading(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, authorName, rating, comment }),
      });
      setDone(true);
      onSubmitted();
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="text-sm text-gray-500 py-4">
        ¡Gracias por tu reseña! Aparecerá en breve.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 block">Tu nombre</label>
        <input
          type="text"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
          maxLength={80}
          placeholder="Ej. Andrés M."
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2">Calificación</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-2xl leading-none transition-colors"
              style={{ color: star <= (hovered || rating) ? '#F59E0B' : '#E5E7EB' }}
              aria-label={`${star} estrellas`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-2 block">
          Comentario <span className="normal-case tracking-normal font-normal text-gray-300">(opcional)</span>
        </label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="¿Cómo te quedó? ¿Qué opinas del material o el diseño?"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !authorName.trim() || rating === 0}
        className="self-start px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest rounded-full transition-all duration-150 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
      >
        {loading ? 'Enviando…' : 'Publicar reseña'}
      </button>
    </form>
  );
}
