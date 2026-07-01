'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/verzus.wear',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@verzus.wear',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.2 8.2 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/573004340482?text=${encodeURIComponent('Hola Verzus, me interesa un producto de la tienda.')}`,
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.122 1.529 5.855L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.727.972.994-3.627-.234-.373A9.818 9.818 0 1112 21.818z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:hola@verzus.co',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const NAV_SECTIONS = [
  {
    label: 'Tienda',
    links: [
      { label: 'Colección completa', href: '/coleccion' },
      { label: 'Novedades', href: '/coleccion' },
      { label: 'Carrito', href: '/carrito' },
      { label: 'Seguimiento de pedido', href: '/seguimiento' },
    ],
  },
  {
    label: 'Ayuda',
    links: [
      { label: 'Preguntas frecuentes', href: '/#faq' },
      { label: 'Políticas de envío', href: '/politicas' },
      { label: 'Cambios y devoluciones', href: '/politicas' },
      { label: 'Contáctanos', href: `https://wa.me/573004340482` },
    ],
  },
  {
    label: 'La marca',
    links: [
      { label: 'Nuestra historia', href: '/nosotros' },
      { label: 'Términos y condiciones', href: '/terminos' },
      { label: 'Política de privacidad', href: '/politicas' },
    ],
  },
];

function PaymentIcons() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Visa */}
      <div className="flex items-center justify-center h-7 px-2.5 rounded border border-gray-200 bg-white">
        <svg width="38" height="12" viewBox="0 0 38 12" fill="none">
          <text x="0" y="11" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="13" fill="#1A1F71" fontStyle="italic">VISA</text>
        </svg>
      </div>
      {/* Mastercard */}
      <div className="flex items-center justify-center h-7 px-2 rounded border border-gray-200 bg-white">
        <svg width="28" height="18" viewBox="0 0 28 18">
          <circle cx="10" cy="9" r="8" fill="#EB001B" />
          <circle cx="18" cy="9" r="8" fill="#F79E1B" />
          <path d="M14 3.35A8 8 0 0114 14.65 8 8 0 0114 3.35z" fill="#FF5F00"/>
        </svg>
      </div>
      {/* PSE */}
      <div className="flex items-center justify-center h-7 px-2.5 rounded border border-gray-200 bg-white">
        <span className="text-[9px] font-black tracking-wider text-[#006EBA]">PSE</span>
      </div>
      {/* Nequi */}
      <div className="flex items-center justify-center h-7 px-2.5 rounded border border-gray-200 bg-white">
        <span className="text-[9px] font-black tracking-wider" style={{ color: '#6B1F97' }}>NEQUI</span>
      </div>
    </div>
  );
}

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Mini trust badges */}
      <div className="border-b border-gray-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center sm:justify-between gap-6">
          {[
            { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', text: 'Envío rápido a todo el país' },
            { icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99', text: 'Cambios fáciles' },
            { icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', text: 'Pagos seguros' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
              </svg>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Image
              src="/images/logo_verzus.svg"
              alt="Verzus"
              width={120}
              height={30}
              className="h-7 w-auto"
              unoptimized
            />
            <p className="text-sm text-gray-500 leading-relaxed">
              Diseñado para moverte.<br />Hecho para acompañarte.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav sections — desktop grid, mobile accordions */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-0 lg:gap-6">
            {NAV_SECTIONS.map(section => (
              <div key={section.label} className="border-b lg:border-0 border-gray-100">
                {/* Mobile accordion toggle */}
                <button
                  type="button"
                  onClick={() => setOpen(o => o === section.label ? null : section.label)}
                  className="lg:hidden w-full flex items-center justify-between py-4 text-left"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-black">{section.label}</span>
                  <span className="text-gray-400 text-base leading-none">{open === section.label ? '−' : '+'}</span>
                </button>

                {/* Desktop label */}
                <p className="hidden lg:block text-xs font-bold uppercase tracking-widest text-black mb-4">{section.label}</p>

                {/* Links */}
                <ul className={`flex flex-col gap-2.5 pb-4 lg:pb-0 overflow-hidden transition-all duration-300 ${
                  open === section.label ? 'max-h-60' : 'max-h-0 lg:max-h-none'
                }`}>
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-500 hover:text-black transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            © {new Date().getFullYear()} VERZUS. Todos los derechos reservados.
          </p>
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
}
