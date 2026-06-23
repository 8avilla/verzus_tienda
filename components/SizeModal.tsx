'use client';

const SIZES = [
  { talla: 'S',   pecho: '91 – 96',   largo: '67', hombros: '40' },
  { talla: 'M',   pecho: '97 – 102',  largo: '69', hombros: '42' },
  { talla: 'L',   pecho: '103 – 108', largo: '71', hombros: '44' },
  { talla: 'XL',  pecho: '109 – 115', largo: '73', hombros: '46' },
  { talla: 'XXL', pecho: '116 – 122', largo: '75', hombros: '48' },
];

export default function SizeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto z-10 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-black uppercase tracking-[0.15em]">
            Guía de tallas
          </h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-black transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Talla', 'Pecho (cm)', 'Largo (cm)', 'Hombros (cm)'].map(h => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((row, i) => (
                <tr
                  key={row.talla}
                  className={`border-b border-gray-50 last:border-0 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}
                >
                  <td className="px-4 py-3 font-semibold text-black">{row.talla}</td>
                  <td className="px-4 py-3 text-gray-600 font-light">{row.pecho}</td>
                  <td className="px-4 py-3 text-gray-600 font-light">{row.largo}</td>
                  <td className="px-4 py-3 text-gray-600 font-light">{row.hombros}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-gray-400 px-5 py-4 border-t border-gray-50">
          ¿Estás entre dos tallas? Te recomendamos elegir la más grande.
        </p>
      </div>
    </div>
  );
}
