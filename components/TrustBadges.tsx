const ITEMS = [
  {
    label: 'Calidad Premium',
    sub: 'Materiales seleccionados',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Envío Rápido',
    sub: 'A todo Colombia',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9.75v9.75" />
      </svg>
    ),
  },
  {
    label: 'Cambios Fáciles',
    sub: '30 días para cambios',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    label: 'Pago Seguro',
    sub: 'Pasarelas certificadas',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-gray-50 border-t border-b border-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
        {ITEMS.map(item => (
          <div key={item.label} className="flex flex-col items-center text-center gap-2">
            <div className="w-11 h-11 rounded-full border border-black/70 flex items-center justify-center text-black shrink-0">
              {item.icon}
            </div>
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-black leading-tight">
              {item.label}
            </p>
            <p className="text-[10px] sm:text-[11px] text-gray-500 leading-tight">
              {item.sub}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
