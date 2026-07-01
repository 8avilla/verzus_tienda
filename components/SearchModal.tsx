'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Result {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string | null;
  soldOut: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setQuery('');
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    search(val);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white w-full max-w-xl mx-auto mt-16 sm:mt-24 rounded-2xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Buscar productos..."
            className="flex-1 text-sm outline-none placeholder-gray-400 text-black"
          />
          {loading && (
            <span className="w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin shrink-0" />
          )}
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-[60vh] overflow-y-auto">
          {results.length > 0 ? (
            <ul>
              {results.map(r => (
                <li key={r.id}>
                  <Link
                    href={`/producto/${r.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-10 aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {r.image && (
                        <Image src={r.image} alt={r.name} fill sizes="48px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">{r.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400">{r.category}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm text-black" style={{ fontFamily: 'var(--font-dm-serif)' }}>
                        ${r.price.toLocaleString('es-CO')}
                      </p>
                      {r.soldOut && (
                        <p className="text-[10px] uppercase tracking-wider text-gray-400">Agotado</p>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : query.length >= 2 && !loading ? (
            <div className="py-10 text-center flex flex-col items-center gap-4">
              <p className="text-sm text-gray-400">Sin resultados para &ldquo;{query}&rdquo;</p>
              <Link
                href={`/coleccion`}
                onClick={onClose}
                className="text-[10px] uppercase tracking-widest border-b border-gray-300 hover:border-black text-gray-400 hover:text-black transition-colors pb-px"
              >
                Ver colección completa →
              </Link>
            </div>
          ) : query.length === 0 ? (
            <div className="px-5 py-6 flex flex-col gap-5">
              <p className="text-[10px] uppercase tracking-widest text-gray-300">Búsquedas populares</p>
              <div className="flex flex-wrap gap-2">
                {['Camisetas', 'Gorras', 'Accesorios', 'Nuevos', 'Agotados no'].map(term => (
                  <button
                    key={term}
                    onClick={() => { setQuery(term); search(term); }}
                    className="px-3 py-1.5 rounded-full border border-gray-200 text-xs text-gray-500 hover:border-black hover:text-black transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 flex flex-col gap-2">
                <p className="text-[10px] uppercase tracking-widest text-gray-300">Explorar</p>
                {[
                  { label: 'Colección completa', href: '/coleccion' },
                  { label: 'Novedades', href: '/coleccion' },
                  { label: 'Nuestra historia', href: '/nosotros' },
                ].map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="text-sm text-gray-500 hover:text-black transition-colors flex items-center justify-between py-1"
                  >
                    {link.label}
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
