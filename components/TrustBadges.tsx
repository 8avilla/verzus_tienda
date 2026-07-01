const ITEMS = [
  { label: 'Calidad Premium', sub: 'Materiales seleccionados' },
  { label: 'Envío a Colombia', sub: 'Rápido y seguro' },
  { label: 'Cambios en 30 días', sub: 'Sin complicaciones' },
  { label: 'Pago Seguro', sub: 'Pasarelas certificadas' },
];

export default function TrustBadges() {
  return (
    <div className="border-t border-gray-100 py-5 px-4">
      <div className="max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-y-2">
        {ITEMS.map((item, i) => (
          <span key={item.label} className="flex items-center">
            <span className="text-[11px] uppercase tracking-[0.15em] text-gray-400 font-medium px-5">
              {item.label}
            </span>
            {i < ITEMS.length - 1 && (
              <span className="text-gray-200 text-xs select-none">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
