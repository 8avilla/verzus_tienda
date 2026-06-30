'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/components/CartProvider';
import { usePopup } from '@/components/PopupProvider';
import { trackEvent } from '@/lib/sessionId';
import SizeModal from '@/components/SizeModal';

const COLOR_MAP: Record<string, string> = {
  negro: '#1a1a1a', blanco: '#f0f0f0', rojo: '#E8001C', azul: '#2563eb',
  verde: '#16a34a', amarillo: '#eab308', gris: '#9ca3af', cafe: '#92400e',
  café: '#92400e', rosado: '#ec4899', rosa: '#f472b6', naranja: '#f97316',
  morado: '#7c3aed', beige: '#d2b48c', crema: '#fef3c7', marino: '#1e3a5f',
  turquesa: '#0d9488', marfil: '#FFFFF0', terracota: '#E2725B', oliva: '#808000',
  camel: '#C19A6B', chocolate: '#7B3F00', lavanda: '#E6E6FA', coral: '#FF7F50',
  menta: '#98FF98', carbon: '#36454F', tinto: '#4A0E2E',
};

function isColorGroup(name: string) {
  return name.toLowerCase().includes('color');
}

function getSwatchColor(opt: string): string | null {
  if (/^#[0-9a-fA-F]{3,8}$/.test(opt)) return opt;
  return COLOR_MAP[opt.toLowerCase()] ?? null;
}

export default function AddToCart({
  product,
  onSelectionChange,
}: {
  product: Product;
  onSelectionChange?: (sel: Record<string, string>, groupName: string) => void;
}) {
  const { addItem, openSidebar } = useCart();
  const { openPopup } = usePopup();
  const [selections, setSelections] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const g of product.variantGroups ?? []) {
      if (g.options.length > 0) init[g.name] = g.options[0];
    }
    return init;
  });
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);

  function handleAdd() {
    const doAdd = () => {
      addItem(product, Object.keys(selections).length > 0 ? selections : undefined);
      openSidebar();
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      trackEvent('add_to_cart', { productId: product.id, productName: product.name, price: product.price });
    };
    if (product.showPopup && product.popupImage) {
      openPopup(doAdd, product.popupImage);
    } else {
      doAdd();
    }
  }

  const groups = product.variantGroups ?? [];

  return (
    <div className="flex flex-col gap-5">
      {groups.map(group => {
        const isColor = isColorGroup(group.name);
        const selected = selections[group.name];
        const hasSizeOptions = !isColor;

        return (
          <div key={group.name}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-black uppercase tracking-widest">
                {group.name}:
                {selected && !/^#[0-9a-fA-F]{3,8}$/.test(selected) && (
                  <span className="font-normal text-gray-500 ml-1">{selected}</span>
                )}
              </p>
              {hasSizeOptions && (
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  Guía de tallas
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5">
              {group.options.map(opt => {
                const swatchColor = isColor ? getSwatchColor(opt) : null;
                const isSelected = selected === opt;

                if (swatchColor) {
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        const next = { ...selections, [group.name]: opt };
                        setSelections(next);
                        onSelectionChange?.(next, group.name);
                      }}
                      title={opt}
                      aria-label={opt}
                      className={`w-9 h-9 rounded-full border-2 transition-all duration-150 ${
                        isSelected ? 'border-black ring-2 ring-black ring-offset-2' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: swatchColor }}
                    />
                  );
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const next = { ...selections, [group.name]: opt };
                      setSelections(next);
                      onSelectionChange?.(next, group.name);
                    }}
                    className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide rounded-lg border transition-all duration-150 ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 text-gray-600 hover:border-black hover:text-black'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Urgencia */}
      {!product.soldOut && product.lastUnits && !(product.stockTracked && product.stock != null && product.stock > 0 && product.stock <= 5) && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-200">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          ¡Últimas unidades disponibles!
        </div>
      )}
      {!product.soldOut && product.stockTracked && product.stock != null && product.stock > 0 && product.stock <= 5 && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${product.stock <= 2 ? 'bg-gray-50 text-black border border-gray-200' : 'bg-orange-50 text-orange-600 border border-orange-200'}`}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {product.stock <= 2 ? `¡${product.stock === 1 ? 'Queda 1 unidad' : `Quedan ${product.stock}`}!` : `Solo ${product.stock} disponibles`}
        </div>
      )}

      {/* CTA principal */}
      <button
        onClick={handleAdd}
        disabled={product.soldOut}
        className={`w-full py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${
          product.soldOut ? 'bg-gray-100 text-gray-400' : added ? 'bg-gray-800 text-white' : 'bg-black hover:bg-gray-800 text-white'
        }`}
      >
        {product.soldOut ? 'Producto agotado' : added ? '✓ ¡Añadido al carrito!' : 'Agregar al carrito'}
      </button>

      {/* Favoritos */}
      <button
        type="button"
        onClick={() => setLiked(l => !l)}
        className={`w-full py-3.5 text-sm font-semibold uppercase tracking-widest rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 ${
          liked ? 'border-black bg-black text-white' : 'border-gray-200 text-black hover:border-black'
        }`}
      >
        <svg className="w-4 h-4 shrink-0" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        {liked ? 'Guardado en favoritos' : 'Agregar a favoritos'}
      </button>

      {/* Trust badges */}
      <div className="flex flex-col divide-y divide-gray-100 border-t border-gray-100 pt-2">
        {[
          { icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12', text: 'Envío rápido a todo Colombia' },
          { icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99', text: 'Cambios fáciles, 30 días' },
          { icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z', text: 'Pago seguro y protegido' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-3 py-3 text-sm text-gray-600">
            <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
            </svg>
            {text}
          </div>
        ))}
      </div>

      {showSizeModal && <SizeModal onClose={() => setShowSizeModal(false)} />}
    </div>
  );
}
