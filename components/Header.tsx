'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

const NAV_LINKS = [
  { label: 'Tallas',    href: '#tallas' },
  { label: 'Preguntas', href: '#faq' },
];

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
    { label: 'Inicio', href: isHome ? '/' : '/' },
    ...navCategories.map(c => ({ label: c.name, href: isHome ? `#catalogo` : `/#catalogo`, slug: c.slug })),
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
              height={20}
              width={100}
              style={{ height: '20px', width: 'auto' }}
              priority
            />
          </Link>

          {/* Nav — desktop */}
          <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={isHome ? link.href : `/${link.href}`}
                className="relative text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors whitespace-nowrap py-1 group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
            <Link
              href="/seguimiento"
              className="relative text-xs uppercase tracking-widest text-gray-500 hover:text-black transition-colors whitespace-nowrap py-1 group"
            >
              Mi pedido
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          </nav>

          {/* Derecha: iconos mobile + carrito desktop */}
          <div className="flex items-center gap-3">

            {/* Lupa — solo mobile */}
            <a
              href={isHome ? '#catalogo' : '/#catalogo'}
              className="lg:hidden flex items-center justify-center w-8 h-8 text-black"
              aria-label="Ver productos"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </a>

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

            {/* Carrito pill — solo desktop */}
            <button
              onClick={openSidebar}
              className="hidden lg:flex relative items-center gap-2 bg-black hover:bg-gray-800 text-white pl-4 pr-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors shrink-0"
              aria-label={`Carrito, ${totalItems} ítems`}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              Carrito
              {totalItems > 0 && (
                <span className="bg-white text-black text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
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
    </>
  );
}
