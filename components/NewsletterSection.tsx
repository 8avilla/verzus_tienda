'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section className="bg-gray-50 border-t border-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center flex flex-col gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold mb-2">Newsletter</p>
          <h2 className="text-xl sm:text-2xl font-bold text-black">Suscríbete</h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Recibe novedades, lanzamientos y ofertas exclusivas.
          </p>
        </div>

        {status === 'ok' ? (
          <p className="text-sm font-medium text-black py-3 border border-black rounded-xl">
            ¡Gracias! Te has suscrito correctamente.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Tu email"
              required
              className="flex-1 border border-gray-200 focus:border-black rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-colors shrink-0"
            >
              {status === 'loading' ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-500">Hubo un error. Intenta de nuevo.</p>
        )}
      </div>
    </section>
  );
}
