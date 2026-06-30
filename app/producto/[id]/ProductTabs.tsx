'use client';

import { useState } from 'react';

type Section = { id: string; label: string; content: React.ReactNode };

function AccordionItem({ section, open, onToggle }: { section: Section; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-black">{section.label}</span>
        <span className="text-gray-400 text-lg leading-none shrink-0 ml-2">{open ? '−' : '+'}</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[500px] pb-5' : 'max-h-0'}`}>
        <div className="text-sm text-gray-600 leading-relaxed">{section.content}</div>
      </div>
    </div>
  );
}

export default function ProductTabs({ description, features }: { description?: string; features?: string[] }) {
  const [openId, setOpenId] = useState<string | null>('details');

  const sections: Section[] = [
    {
      id: 'details',
      label: 'Detalles del producto',
      content: (
        <div className="flex flex-col gap-2">
          {features && features.length > 0
            ? features.map((f, i) => (
                <div key={i} className="flex items-start gap-3">
                  <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{f}</span>
                </div>
              ))
            : description
              ? <p>{description}</p>
              : <p className="text-gray-400 italic">Sin descripción disponible.</p>
          }
        </div>
      ),
    },
    {
      id: 'shipping',
      label: 'Envíos y devoluciones',
      content: (
        <div className="flex flex-col gap-2.5">
          <p>Realizamos envíos a todo el territorio colombiano en <strong className="text-black">3 a 7 días hábiles</strong> según tu municipio.</p>
          <p>El costo del domicilio se calcula al momento de confirmar tu pedido.</p>
          <p>Para cambios tienes <strong className="text-black">30 días</strong> desde la fecha de recibo. El producto debe estar en perfectas condiciones y con su empaque original.</p>
        </div>
      ),
    },
    {
      id: 'care',
      label: 'Cuidados',
      content: (
        <div className="flex flex-col gap-2">
          {[
            'Lavar a mano o en ciclo delicado a 30°C',
            'No usar blanqueadores ni suavizantes',
            'No meter a la secadora — secar a la sombra',
            'No planchar directamente sobre la tela',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3">
              <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="border-t border-gray-200">
      {sections.map(s => (
        <AccordionItem
          key={s.id}
          section={s}
          open={openId === s.id}
          onToggle={() => setOpenId(prev => (prev === s.id ? null : s.id))}
        />
      ))}
    </div>
  );
}
