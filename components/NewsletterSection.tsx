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
    <section className="bg-black py-16 px-4 sm:px-6">
      <div className="max-w-xl mx-auto text-center flex flex-col gap-6">

        <div className="flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-semibold">
            ✦ Newsletter
          </p>
          <h2
            className="text-3xl sm:text-4xl text-white font-normal italic leading-tight"
            style={{ fontFamily: 'var(--font-dm-serif)' }}
          >
            Acceso anticipado a<br />nuevas colecciones
          </h2>
          <p className="text-sm text-white/50 leading-relaxed">
            Suscríbete y recibe primero los lanzamientos, drops exclusivos y contenido de la marca.
          </p>
        </div>

        {status === 'ok' ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <span className="text-2xl">✓</span>
            <p className="text-sm text-white/70">Ya estás en la lista.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 bg-white/10 border border-white/20 focus:border-white/50 focus:bg-white/15 text-white placeholder:text-white/30 rounded-none px-4 py-3.5 text-sm focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-white hover:bg-gray-100 disabled:opacity-50 text-black text-[11px] font-bold uppercase tracking-[0.18em] px-7 py-3.5 transition-colors shrink-0"
            >
              {status === 'loading' ? '…' : 'Suscribirse'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-400">Hubo un error. Intenta de nuevo.</p>
        )}

        <p className="text-[10px] text-white/25 tracking-wide">
          Sin spam. Cancela cuando quieras.
        </p>
      </div>
    </section>
  );
}
