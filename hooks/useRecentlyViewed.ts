'use client';

import { useEffect, useState } from 'react';

const KEY = 'verzus_recently_viewed';
const MAX = 6;

export interface RecentProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function useTrackView(product: RecentProduct) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list: RecentProduct[] = raw ? JSON.parse(raw) : [];
      const filtered = list.filter(p => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch { /* noop */ }
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useRecentlyViewed(excludeId?: string): RecentProduct[] {
  const [items, setItems] = useState<RecentProduct[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const list: RecentProduct[] = raw ? JSON.parse(raw) : [];
      setItems(excludeId ? list.filter(p => p.id !== excludeId) : list);
    } catch { /* noop */ }
  }, [excludeId]);

  return items;
}
