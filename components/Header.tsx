'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import SearchModal from '@/components/SearchModal';

interface NavCategory {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  navCategories?: NavCategory[];
}

export default function Header({ navCategories = [] }: Props) {
  const { totalItems, openSidebar } = useCart();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  function closeMenu() { setMenuOpen(false); }

  const drawerItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Colección', href: '/coleccion' },
    ...navCategories.map(c => ({ label: c.name, href: `/coleccion?categoria=${encodeURIComponent(c.name)}`, slug: c.slug })),
    { label: 'Tallas', href: isHome ? '#tallas' : '/#tallas' },
    { label: 'Preguntas frecuentes', href: isHome ? '#faq' : '/#faq' },
  ];

  return (
    <>
      {/* ── HEADER BAR ── */}
      <header className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-150'
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-14' : 'h-16'
        }`}>

          {/* Hamburger — izquierda en mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8 shrink-0"
            aria-label="Abrir menú"
          >
            <span className="block h-px w-5 bg-black" />
            <span className="block h-px w-5 bg-black" />
            <span className="block h-px w-5 bg-black" />
          </button>

          {/* Logo — centrado absolutamente en mobile, izquierda en desktop */}
          <Link
            href="/"
            onClick={e => { if (isHome) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center shrink-0 cursor-pointer select-none hover:opacity-75 transition-opacity duration-200"
          >
            <Image
              src="/images/logo_verzus.svg"
              alt="Verzus"
              height={52}
              width={260}
              className="h-[52px] w-auto"
              priority
              unoptimized
            />
          </Link>

          {/* Nav — desktop, generada dinámicamente desde las categorías */}
          <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-5 xl:gap-7 overflow-x-auto scrollbar-none px-4 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]">
            <Link
              href="/coleccion"
              className="relative text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors whitespace-nowrap py-1 shrink-0 group"
            >
              Nuevo
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
            {navCategories.map(cat => (
              <Link
                key={cat.id}
                href={`/coleccion?categoria=${encodeURIComponent(cat.name)}`}
                className="relative text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors whitespace-nowrap py-1 shrink-0 group"
              >
                {cat.name}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </nav>

          {/* Derecha: iconos mobile + utilidades desktop */}
          <div className="flex items-center gap-3 lg:gap-6 shrink-0">

            {/* Lupa — mobile y desktop */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1.5 text-black lg:text-gray-500 lg:hover:text-black transition-colors"
              aria-label="Buscar"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="hidden lg:inline text-xs uppercase tracking-widest whitespace-nowrap">Buscar</span>
            </button>

            {/* Favoritos — solo desktop, visual por ahora */}
            <button
              className="hidden lg:flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors"
              aria-label="Favoritos"
              title="Favoritos (próximamente)"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-xs uppercase tracking-widest whitespace-nowrap">Favoritos</span>
            </button>

            {/* Bolsa — solo mobile */}
            <button
              onClick={openSidebar}
              className="lg:hidden relative flex items-center justify-center w-8 h-8 text-black"
              aria-label={`Carrito, ${totalItems} ítems`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none"
                  style={{ backgroundColor: 'var(--accent)' }}
                >
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {/* Carrito — solo desktop, ícono + texto plano */}
            <button
              onClick={openSidebar}
              className="hidden lg:flex items-center gap-1.5 text-gray-500 hover:text-black transition-colors"
              aria-label={`Carrito, ${totalItems} ítems`}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
                />
              </svg>
              <span className="text-xs uppercase tracking-widest whitespace-nowrap">Carrito ({totalItems})</span>
            </button>

          </div>
        </div>
      </header>

      {/* ── DRAWER MOBILE ── */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closeMenu}
        />

        {/* Panel */}
        <div className={`absolute inset-y-0 left-0 w-4/5 max-w-sm bg-gray-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

          {/* Top: botón cerrar */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <button
              onClick={closeMenu}
              aria-label="Cerrar menú"
              className="w-8 h-8 flex items-center justify-center text-black hover:opacity-50 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Items de navegación */}
          <nav className="flex-1 overflow-y-auto px-5">
            {drawerItems.map((item, i) => {
              const isCategory = navCategories.some(c => c.name === item.label);
              return (
                <a
                  key={i}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-4 border-b border-gray-200 text-sm font-semibold uppercase tracking-widest transition-colors duration-150 hover:text-[var(--accent)] ${
                    menuOpen ? 'animate-fade-up' : 'opacity-0'
                  }`}
                  style={{
                    animationDelay: menuOpen ? `${i * 50 + 80}ms` : '0ms',
                    color: i === 0 ? 'inherit' : 'inherit',
                  }}
                >
                  {item.label}
                  {isCategory && (
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Footer: Mi pedido */}
          <div className="px-5 py-6 border-t border-gray-200">
            <Link
              href="/seguimiento"
              onClick={closeMenu}
              className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              Seguimiento de pedido
            </Link>
          </div>

        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
