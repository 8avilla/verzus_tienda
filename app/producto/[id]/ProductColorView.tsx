'use client';

import { useState } from 'react';
import { Product } from '@/types';
import ProductGallery from './ProductGallery';
import AddToCart from './AddToCart';
import ProductTabs from './ProductTabs';
import { useTrackView } from '@/hooks/useRecentlyViewed';

interface ReviewStats { count: number; avg: number }

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating.toFixed(1)} estrellas`}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= Math.round(rating) ? '#F59E0B' : '#E5E7EB' }} className="text-base leading-none">★</span>
      ))}
    </span>
  );
}

export default function ProductColorView({ product, reviewStats }: { product: Product; reviewStats?: ReviewStats }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  useTrackView({ id: product.id, name: product.name, price: product.price, image: product.images[0] ?? '', category: product.category });

  function handleSelectionChange(selections: Record<string, string>, changedGroup?: string) {
    const groups = product.variantGroups ?? [];
    // Check the group that just changed first; if it has an imageMap entry, use it.
    // Fall back to other groups only if the changed group has no imageMap.
    const ordered = changedGroup
      ? [groups.find(g => g.name === changedGroup), ...groups.filter(g => g.name !== changedGroup)].filter(Boolean)
      : groups;
    for (const group of ordered) {
      if (!group?.imageMap) continue;
      const selected = selections[group.name];
      if (selected !== undefined && group.imageMap[selected] !== undefined) {
        setActiveImageIndex(group.imageMap[selected]);
        return;
      }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">

      <ProductGallery
        images={product.images}
        name={product.name}
        freeShipping={product.freeShipping}
        activeIndex={activeImageIndex}
        onActiveIndexChange={setActiveImageIndex}
        videoUrl={product.videoUrl}
      />

      <div className="flex flex-col gap-5 lg:py-4 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5rem)] lg:overflow-y-auto">

        {/* Categoría */}
        <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400 font-semibold">{product.category}</p>

        {/* Nombre */}
        <h1
          className="text-3xl sm:text-4xl text-black leading-tight font-normal"
          style={{ fontFamily: 'var(--font-dm-serif)' }}
        >
          {product.name}
        </h1>

        {/* Tagline */}
        {product.tagline && (
          <p className="text-sm text-gray-400 leading-snug -mt-2 italic" style={{ fontFamily: 'var(--font-dm-serif)' }}>
            {product.tagline}
          </p>
        )}

        {/* Precio */}
        <p className="text-lg font-light text-gray-500">
          ${product.price.toLocaleString('es-CO')}
          <span className="text-sm text-gray-400 ml-1.5">COP</span>
        </p>

        {/* Rating */}
        {reviewStats && reviewStats.count > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={reviewStats.avg} />
            <span className="text-xs text-gray-500">({reviewStats.count} reseñas)</span>
          </div>
        )}

        {/* Descripción corta */}
        {product.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        )}

        {/* Variantes + CTA */}
        <div id="add-to-cart-section">
          <AddToCart product={product} onSelectionChange={handleSelectionChange} />
        </div>

        {/* Acordeones */}
        <ProductTabs description={product.description} features={product.features} />
      </div>
    </div>
  );
}
