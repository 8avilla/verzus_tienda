'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { useCart } from '@/components/CartProvider';

export default function StickyAddToCart({ product }: { product: Product }) {
  const [visible, setVisible] = useState(false);
  const { addItem, openSidebar } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const target = document.getElementById('add-to-cart-section');
    if (!target) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { rootMargin: '0px 0px -80px 0px' }
    );
    obs.observe(target);
    return () => obs.disconnect();
  }, []);

  if (product.soldOut) return null;

  function handleAdd() {
    addItem(product);
    openSidebar();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden transition-transform duration-300 ease-out ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-normal text-black truncate" style={{ fontFamily: 'var(--font-dm-serif)' }}>
            {product.name}
          </p>
          <p className="text-[11px] text-gray-400 font-light">
            ${product.price.toLocaleString('es-CO')} COP
          </p>
        </div>
        <button
          onClick={handleAdd}
          className={`shrink-0 px-6 py-3 text-[11px] font-bold uppercase tracking-widest transition-all duration-200 active:scale-[0.97] ${
            added ? 'bg-gray-700 text-white' : 'bg-black text-white hover:bg-gray-800'
          }`}
        >
          {added ? '✓ Añadido' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}
