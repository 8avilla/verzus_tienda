'use client';

import { useState } from 'react';

const WA = `https://wa.me/573004340482?text=${encodeURIComponent('Hola Verzus, tengo una pregunta sobre mi pedido.')}`;

const ITEMS = [
  {
    q: '¿Cómo elijo mi talla?',
    a: 'Escribe tu talla habitual. Si dudas entre dos, elige la más grande: nuestras prendas tienen un corte ajustado pero confortable. Para ayuda personalizada escríbenos por WhatsApp y te asesoramos.',
  },
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Despachamos en 1–2 días hábiles. La entrega toma 2–5 días adicionales según tu ciudad. Ciudades principales (Bogotá, Medellín, Cali, Barranquilla) reciben en 2–3 días hábiles.',
  },
  {
    q: '¿Puedo hacer cambios o devoluciones?',
    a: 'Sí. Atendemos cambios por talla o defecto de fabricación dentro de los 5 días hábiles de haber recibido tu pedido. Escríbenos por WhatsApp con fotos del producto y lo coordinamos.',
  },
];

export default function MiniFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="border-t border-gray-100 py-14 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold text-center">
          Preguntas frecuentes
        </p>

        <div className="flex flex-col divide-y divide-gray-100">
          {ITEMS.map((item, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpen(o => o === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left gap-4"
              >
                <span className="text-sm font-semibold text-black">{item.q}</span>
                <span className={`text-gray-400 text-xl leading-none shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${open === i ? 'max-h-48 pb-4' : 'max-h-0'}`}>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href={WA}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black transition-colors"
          >
            <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.122 1.529 5.855L0 24l6.335-1.652A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.37l-.36-.214-3.727.972.994-3.627-.234-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            ¿Tienes otra pregunta? Escríbenos por WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
