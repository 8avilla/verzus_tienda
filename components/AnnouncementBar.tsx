'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  text?: string;
  enabled?: boolean;
}

const DEFAULT_TEXT = 'Nueva Colección · Envíos a toda Colombia · Pago Seguro con Bold · Diseños Exclusivos · Ropa para gente como tú · Verzus';

export default function AnnouncementBar({ text = DEFAULT_TEXT, enabled = true }: Props) {
  const messages = (text).split('·').map(s => s.trim()).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), 4000);
    return () => clearInterval(id);
  }, [messages.length]);

  if (!enabled) return null;

  const prev = () => setIdx(i => (i - 1 + messages.length) % messages.length);
  const next = () => setIdx(i => (i + 1) % messages.length);

  return (
    <div
      className="bg-black text-white py-2.5 select-none"
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <button
          onClick={prev}
          aria-label="Anterior"
          className={`text-white/80 hover:text-white text-lg leading-none shrink-0 transition-opacity ${messages.length <= 1 ? 'invisible' : ''}`}
        >
          ‹
        </button>

        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-center flex-1 truncate transition-all duration-300">
          {messages[idx]}
        </p>

        <button
          onClick={next}
          aria-label="Siguiente"
          className={`text-white/80 hover:text-white text-lg leading-none shrink-0 transition-opacity ${messages.length <= 1 ? 'invisible' : ''}`}
        >
          ›
        </button>

        {/* Utilidades — solo desktop */}
        <div className="hidden lg:flex items-center gap-5 shrink-0 ml-2 pl-4 border-l border-white/20">
          <span className="text-[10px] uppercase tracking-widest text-white/70 whitespace-nowrap">
            Colombia (COP $)
          </span>
          <a
            href={isHome ? '#faq' : '/#faq'}
            className="text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors whitespace-nowrap"
          >
            Ayuda
          </a>
          <Link
            href="/seguimiento"
            className="text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-colors whitespace-nowrap"
          >
            Mi cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}
