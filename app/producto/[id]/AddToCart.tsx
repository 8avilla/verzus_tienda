'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/components/CartProvider';
import { usePopup } from '@/components/PopupProvider';
import { trackEvent } from '@/lib/sessionId';
import SizeModal from '@/components/SizeModal';

function isHexColor(s: string) {
  return /^#[0-9a-fA-F]{6}$/.test(s);
}

export default function AddToCart({
  product,
  onSelectionChange,
}: {
  product: Product;
  onSelectionChange?: (sel: Record<string, string>) => void;
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
        const hasSizeOptions = group.options.some(opt => !isHexColor(opt));
        return (
          <div key={group.name}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{group.name}</p>
              {hasSizeOptions && (
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="text-[10px] uppercase tracking-widest text-gray-400 underline underline-offset-2 hover:text-black transition-colors"
                >
                  ¿Cuál es mi talla?
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.options.map(opt => {
                const isColor = isHexColor(opt);
                const selected = selections[group.name] === opt;
                return isColor ? (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const next = { ...selections, [group.name]: opt };
                      setSelections(next);
                      onSelectionChange?.(next);
                    }}
                    title={opt}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                      selected
                        ? 'border-black ring-2 ring-black ring-offset-1'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: opt }}
                  />
                ) : (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      const next = { ...selections, [group.name]: opt };
                      setSelections(next);
                      onSelectionChange?.(next);
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-wide rounded-full border transition-all duration-150 ${
                      selected
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

      {/* Urgencia por últimas unidades (manual) */}
      {!product.soldOut && product.lastUnits && !(product.stockTracked && product.stock != null && product.stock > 0 && product.stock <= 5) && (
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-orange-50 text-orange-600 border border-orange-200">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          ¡Últimas unidades disponibles — no te quedes sin el tuyo!
        </div>
      )}

      {/* Urgencia por stock bajo */}
      {!product.soldOut && product.stockTracked && product.stock != null && product.stock > 0 && product.stock <= 5 && (
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold ${
          product.stock <= 2
            ? 'bg-gray-50 text-black border border-gray-200'
            : 'bg-orange-50 text-orange-600 border border-orange-200'
        }`}>
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {product.stock <= 2
            ? `¡${product.stock === 1 ? 'Queda solo 1 unidad' : `Quedan solo ${product.stock} unidades`}!`
            : `Solo ${product.stock} disponibles — ¡no te quedes sin el tuyo!`}
        </div>
      )}

      <button
        onClick={handleAdd}
        disabled={product.soldOut}
        className={`w-full py-4 text-sm font-semibold uppercase tracking-widest rounded-xl transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed ${
          product.soldOut
            ? 'bg-gray-100 text-gray-400'
            : added
              ? 'bg-black text-white'
              : 'bg-black hover:bg-gray-800 text-white'
        }`}
      >
        {product.soldOut ? 'Producto agotado' : added ? '✓ ¡Añadido al carrito!' : '+ Añadir al carrito'}
      </button>

      {/* Trust signals */}
      <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          Envío seguro a toda Colombia
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Cambios fáciles por talla — 15 días
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          Pago 100% protegido
        </div>
      </div>

      {showSizeModal && <SizeModal onClose={() => setShowSizeModal(false)} />}
    </div>
  );
}
