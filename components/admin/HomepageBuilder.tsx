'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import {
  HomepageSection, BlockType, HeroConfig, HeroSlide, CarouselConfig,
  BannerConfig, TextConfig, FeaturedConfig, CollectionGridConfig, CollectionGridItem,
  LifestyleBannerConfig, InstagramGridConfig, TestimonialsConfig, TestimonialItem,
} from '@/types/homepage';
import { CategoryDoc, Product } from '@/types';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

interface Props {
  initial: HomepageSection[];
  categories: CategoryDoc[];
  products: Product[];
}

const BLOCK_META: Record<BlockType, { label: string; color: string; icon: React.ReactNode }> = {
  hero: {
    label: 'Hero',
    color: 'bg-violet-100 text-violet-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  category_carousel: {
    label: 'Carousel',
    color: 'bg-blue-100 text-blue-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  image_banner: {
    label: 'Banner',
    color: 'bg-amber-100 text-amber-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  text_block: {
    label: 'Texto',
    color: 'bg-green-100 text-green-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
  },
  featured_products: {
    label: 'Destacados',
    color: 'bg-rose-100 text-rose-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
  lifestyle_banner: {
    label: 'Banner lifestyle',
    color: 'bg-pink-100 text-pink-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  instagram_grid: {
    label: 'Instagram',
    color: 'bg-orange-100 text-orange-700',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
      </svg>
    ),
  },
  collection_grid: {
    label: 'Grilla de colecciones',
    color: 'bg-teal-100 text-teal-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  testimonials: {
    label: 'Testimonios',
    color: 'bg-indigo-100 text-indigo-700',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
};

const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  hero: 'Carrusel principal de la portada',
  category_carousel: 'Muestra productos de una categoría',
  image_banner: 'Franja editorial entre secciones',
  text_block: 'Sección de texto con fondo negro o blanco',
  featured_products: 'Selección manual de productos',
  collection_grid: 'Grilla de tarjetas hacia colecciones',
  lifestyle_banner: 'Banner editorial con texto e imágenes',
  instagram_grid: 'Grid de fotos del Instagram',
  testimonials: 'Reseñas y opiniones de clientes',
};

function getDefaultConfig(type: BlockType): HomepageSection['config'] {
  switch (type) {
    case 'hero': return { slides: [{}] };
    case 'category_carousel': return { categoryName: '', maxProducts: 4 };
    case 'image_banner': return { text: '', link: '' };
    case 'text_block': return { heading: '', body: '', bg: 'black' };
    case 'featured_products': return { productIds: [], title: '' };
    case 'collection_grid': return { items: [{ title: '' }] };
    case 'lifestyle_banner': return { label: 'Verzus Lifestyle', heading: '', body: '', cta: 'Descubrir más', link: '/coleccion', images: [], bg: 'light' };
    case 'instagram_grid': return { handle: '@verzus.wear', images: [] };
    case 'testimonials': return { label: 'Lo que dicen nuestros clientes', heading: 'Ellas ya lo viven.', items: [{ name: '', text: '', rating: 5, location: '' }] };
  }
}

function getSlides(cfg: HeroConfig): HeroSlide[] {
  if (cfg.slides && cfg.slides.length > 0) return cfg.slides;
  return [{
    image: cfg.image,
    eyebrow: cfg.eyebrow,
    headingLine1: cfg.headingLine1,
    headingLine2: cfg.headingLine2,
    body: cfg.body,
    cta: cfg.cta,
  }];
}

function inputCls(full = true) {
  return `border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 transition-colors ${full ? 'w-full' : ''}`;
}

export default function HomepageBuilder({ initial, categories, products }: Props) {
  const [sections, setSections] = useState<HomepageSection[]>(initial);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // ── helpers ──────────────────────────────────────────────────────────────────

  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleEnabled(id: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  }

  function updateConfig(id: string, patch: Record<string, unknown>) {
    setSections(prev => prev.map(s =>
      s.id === id ? { ...s, config: { ...s.config, ...patch } } : s
    ));
  }

  function removeSection(id: string) {
    setSections(prev => prev.filter(s => s.id !== id));
    setExpanded(prev => { const next = new Set(prev); next.delete(id); return next; });
  }

  function addSection(type: BlockType) {
    const id = crypto.randomUUID();
    setSections(prev => [...prev, { id, type, enabled: true, config: getDefaultConfig(type) }]);
    setExpanded(prev => new Set([...prev, id]));
    setShowPicker(false);
  }

  function moveSection(from: number, to: number) {
    if (to < 0 || to >= sections.length) return;
    const next = [...sections];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setSections(next);
  }

  async function uploadImage(sectionId: string, file: File) {
    setUploading(sectionId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Error subiendo imagen');
      updateConfig(sectionId, { image: data.url });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error subiendo imagen');
    } finally {
      setUploading(null);
    }
  }

  async function uploadToUrl(key: string, file: File): Promise<string | null> {
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Error subiendo imagen');
      return data.url as string;
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error subiendo imagen');
      return null;
    } finally {
      setUploading(null);
    }
  }

  // ── slides del hero ─────────────────────────────────────────────────────────

  function updateSlide(s: HomepageSection, idx: number, patch: Partial<HeroSlide>) {
    const cfg = s.config as HeroConfig;
    const slides = getSlides(cfg).map((sl, i) => i === idx ? { ...sl, ...patch } : sl);
    updateConfig(s.id, { slides });
  }

  function addSlide(s: HomepageSection) {
    const cfg = s.config as HeroConfig;
    updateConfig(s.id, { slides: [...getSlides(cfg), {}] });
  }

  function removeSlide(s: HomepageSection, idx: number) {
    const cfg = s.config as HeroConfig;
    updateConfig(s.id, { slides: getSlides(cfg).filter((_, i) => i !== idx) });
  }

  async function uploadSlideImage(s: HomepageSection, idx: number, file: File) {
    const url = await uploadToUrl(`${s.id}__slide${idx}`, file);
    if (url) updateSlide(s, idx, { image: url });
  }

  // ── items de la grilla de colecciones ───────────────────────────────────────

  function updateGridItem(s: HomepageSection, idx: number, patch: Partial<CollectionGridItem>) {
    const cfg = s.config as CollectionGridConfig;
    const items = (cfg.items ?? []).map((it, i) => i === idx ? { ...it, ...patch } : it);
    updateConfig(s.id, { items });
  }

  function addGridItem(s: HomepageSection) {
    const cfg = s.config as CollectionGridConfig;
    updateConfig(s.id, { items: [...(cfg.items ?? []), { title: '' }] });
  }

  function removeGridItem(s: HomepageSection, idx: number) {
    const cfg = s.config as CollectionGridConfig;
    updateConfig(s.id, { items: (cfg.items ?? []).filter((_, i) => i !== idx) });
  }

  async function uploadGridItemImage(s: HomepageSection, idx: number, file: File) {
    const url = await uploadToUrl(`${s.id}__item${idx}`, file);
    if (url) updateGridItem(s, idx, { image: url });
  }

  async function handleSave() {
    setSaving(true);
    setApiError('');
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections),
      });
      if (!res.ok) throw new Error('Error guardando');
      Toast.fire({ icon: 'success', title: 'Portada guardada correctamente' });
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  }

  // ── block label ──────────────────────────────────────────────────────────────

  function blockLabel(s: HomepageSection) {
    const base = BLOCK_META[s.type]?.label ?? s.type;
    if (s.type === 'category_carousel') {
      const cfg = s.config as CarouselConfig;
      return cfg.categoryName ? `${base} · ${cfg.titleOverride || cfg.categoryName}` : base;
    }
    if (s.type === 'featured_products') {
      const cfg = s.config as FeaturedConfig;
      return cfg.title ? `${base} · ${cfg.title}` : base;
    }
    return base;
  }

  // ── block editors ────────────────────────────────────────────────────────────

  function renderEditor(s: HomepageSection) {
    switch (s.type) {

      case 'hero': {
        const cfg = s.config as HeroConfig;
        const slides = getSlides(cfg);
        return (
          <div className="flex flex-col gap-5">
            {slides.map((slide, idx) => {
              const key = `${s.id}__slide${idx}`;
              return (
                <div key={idx} className="flex flex-col gap-3 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                      Slide {idx + 1}
                    </span>
                    {slides.length > 1 && (
                      <button type="button" onClick={() => removeSlide(s, idx)}
                        className="text-[11px] text-red-500 hover:text-black transition-colors">
                        Quitar slide
                      </button>
                    )}
                  </div>

                  {/* Imagen */}
                  {slide.image ? (
                    <div className="flex flex-col gap-2">
                      <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={slide.image} alt={`Slide ${idx + 1}`} fill sizes="400px" className="object-cover" />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => fileRefs.current[key]?.click()}
                          className="text-xs border border-gray-200 hover:border-black px-3 py-1.5 rounded-lg transition-colors">
                          {uploading === key ? 'Subiendo…' : 'Cambiar'}
                        </button>
                        <button type="button" onClick={() => updateSlide(s, idx, { image: '' })}
                          className="text-xs text-red-500 hover:text-black transition-colors">Eliminar</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRefs.current[key]?.click()}
                      disabled={uploading === key}
                      className="w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 transition-colors disabled:opacity-50">
                      {uploading === key ? <span className="text-xs">Subiendo…</span> : (
                        <>
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs">Subir imagen</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={el => { fileRefs.current[key] = el; }} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadSlideImage(s, idx, f); e.target.value = ''; }} />

                  {/* Textos */}
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Etiqueta superior (eyebrow)</span>
                    <input type="text" placeholder="Nueva colección"
                      value={slide.eyebrow ?? ''}
                      onChange={e => updateSlide(s, idx, { eyebrow: e.target.value })}
                      className={inputCls()} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400">Título línea 1</span>
                      <input type="text" placeholder="Diseñado para moverte."
                        value={slide.headingLine1 ?? ''}
                        onChange={e => updateSlide(s, idx, { headingLine1: e.target.value })}
                        className={inputCls()} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400">Título línea 2</span>
                      <input type="text" placeholder="Hecho para acompañarte."
                        value={slide.headingLine2 ?? ''}
                        onChange={e => updateSlide(s, idx, { headingLine2: e.target.value })}
                        className={inputCls()} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Descripción</span>
                    <textarea rows={2} placeholder="Activewear premium que combina…"
                      value={slide.body ?? ''}
                      onChange={e => updateSlide(s, idx, { body: e.target.value })}
                      className={inputCls() + ' resize-none'} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Botón CTA</span>
                    <input type="text" placeholder="Descubrir colección"
                      value={slide.cta ?? ''}
                      onChange={e => updateSlide(s, idx, { cta: e.target.value })}
                      className={inputCls()} />
                  </div>
                </div>
              );
            })}

            <button type="button" onClick={() => addSlide(s)}
              className="border-2 border-dashed border-gray-200 hover:border-black text-gray-400 hover:text-black rounded-xl py-2.5 text-xs font-medium transition-colors">
              + Agregar slide
            </button>
          </div>
        );
      }

      case 'collection_grid': {
        const cfg = s.config as CollectionGridConfig;
        const items = cfg.items ?? [];
        return (
          <div className="flex flex-col gap-5">
            {items.map((item, idx) => {
              const key = `${s.id}__item${idx}`;
              return (
                <div key={idx} className="flex flex-col gap-3 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                      Tarjeta {idx + 1}
                    </span>
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeGridItem(s, idx)}
                        className="text-[11px] text-red-500 hover:text-black transition-colors">
                        Quitar
                      </button>
                    )}
                  </div>

                  {item.image ? (
                    <div className="flex flex-col gap-2">
                      <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <Image src={item.image} alt={item.title || `Tarjeta ${idx + 1}`} fill sizes="300px" className="object-cover" />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => fileRefs.current[key]?.click()}
                          className="text-xs border border-gray-200 hover:border-black px-3 py-1.5 rounded-lg transition-colors">
                          {uploading === key ? 'Subiendo…' : 'Cambiar'}
                        </button>
                        <button type="button" onClick={() => updateGridItem(s, idx, { image: '' })}
                          className="text-xs text-red-500 hover:text-black transition-colors">Eliminar</button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileRefs.current[key]?.click()}
                      disabled={uploading === key}
                      className="w-full max-w-[180px] aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 transition-colors disabled:opacity-50">
                      {uploading === key ? <span className="text-xs">Subiendo…</span> : (
                        <>
                          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-xs">Subir imagen</span>
                        </>
                      )}
                    </button>
                  )}
                  <input ref={el => { fileRefs.current[key] = el; }} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadGridItemImage(s, idx, f); e.target.value = ''; }} />

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Título</span>
                    <input type="text" placeholder="Ej: Colección Movement"
                      value={item.title ?? ''}
                      onChange={e => updateGridItem(s, idx, { title: e.target.value })}
                      className={inputCls()} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Descripción corta <span className="normal-case font-normal text-gray-400">(opcional)</span></span>
                    <input type="text" placeholder="Ej: Ropa diseñada para cada paso que das."
                      value={(item as CollectionGridItem).subtitle ?? ''}
                      onChange={e => updateGridItem(s, idx, { subtitle: e.target.value })}
                      className={inputCls()} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Link <span className="normal-case font-normal text-gray-400">(opcional, por defecto /coleccion)</span></span>
                    <input type="text" placeholder="/coleccion?categoria=Sets"
                      value={item.link ?? ''}
                      onChange={e => updateGridItem(s, idx, { link: e.target.value })}
                      className={inputCls()} />
                  </div>
                </div>
              );
            })}

            <button type="button" onClick={() => addGridItem(s)}
              className="border-2 border-dashed border-gray-200 hover:border-black text-gray-400 hover:text-black rounded-xl py-2.5 text-xs font-medium transition-colors">
              + Agregar tarjeta
            </button>
          </div>
        );
      }

      case 'category_carousel': {
        const cfg = s.config as CarouselConfig;
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Categoría</label>
              <select value={cfg.categoryName} onChange={e => updateConfig(s.id, { categoryName: e.target.value })}
                className={inputCls().replace('px-3', 'px-2')}>
                <option value="">— Seleccionar categoría —</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  Máx. productos <span className="normal-case font-normal text-gray-400">({cfg.maxProducts || 4})</span>
                </label>
                <input type="range" min={1} max={8} value={cfg.maxProducts || 4}
                  onChange={e => updateConfig(s.id, { maxProducts: Number(e.target.value) })}
                  className="w-full accent-black" />
                <div className="flex justify-between text-[10px] text-gray-300">
                  <span>1</span><span>8</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Título <span className="normal-case font-normal text-gray-400">(opcional, sobreescribe el nombre)</span>
              </label>
              <input value={cfg.titleOverride ?? ''} onChange={e => updateConfig(s.id, { titleOverride: e.target.value })}
                placeholder={cfg.categoryName || 'Nombre de la categoría'} className={inputCls()} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Subtítulo <span className="normal-case font-normal text-gray-400">(opcional, sobreescribe el de la categoría)</span>
              </label>
              <input value={cfg.subtitleOverride ?? ''} onChange={e => updateConfig(s.id, { subtitleOverride: e.target.value })}
                placeholder="Ej: ¡Se están agotando!" className={inputCls()} />
            </div>
          </div>
        );
      }

      case 'image_banner': {
        const cfg = s.config as BannerConfig;
        return (
          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Imagen de fondo</label>
            {cfg.image ? (
              <div className="flex flex-col gap-2">
                <div className="relative w-full max-w-sm h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <Image src={cfg.image} alt="Banner" fill sizes="400px" className="object-cover" />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => fileRefs.current[s.id]?.click()}
                    className="text-xs border border-gray-200 hover:border-black px-3 py-1.5 rounded-lg transition-colors">
                    {uploading === s.id ? 'Subiendo…' : 'Cambiar'}
                  </button>
                  <button type="button" onClick={() => updateConfig(s.id, { image: '' })}
                    className="text-xs text-red-500 hover:text-black transition-colors">Eliminar</button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => fileRefs.current[s.id]?.click()}
                disabled={uploading === s.id}
                className="w-full max-w-sm h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-gray-400 transition-colors disabled:opacity-50">
                {uploading === s.id ? <span className="text-xs">Subiendo…</span> : (
                  <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg><span className="text-xs">Subir imagen</span></>
                )}
              </button>
            )}
            <input ref={el => { fileRefs.current[s.id] = el; }} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(s.id, f); e.target.value = ''; }} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Texto overlay</label>
              <input value={cfg.text ?? ''} onChange={e => updateConfig(s.id, { text: e.target.value })}
                placeholder="Ej: Nueva colección" className={inputCls()} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Link <span className="normal-case font-normal text-gray-400">(opcional)</span>
              </label>
              <input value={cfg.link ?? ''} onChange={e => updateConfig(s.id, { link: e.target.value })}
                placeholder="/coleccion" className={inputCls()} />
            </div>
          </div>
        );
      }

      case 'text_block': {
        const cfg = s.config as TextConfig;
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Título</label>
              <input value={cfg.heading ?? ''} onChange={e => updateConfig(s.id, { heading: e.target.value })}
                placeholder="Ej: Hecho en Colombia" className={inputCls()} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Párrafo</label>
              <textarea rows={3} value={cfg.body ?? ''} onChange={e => updateConfig(s.id, { body: e.target.value })}
                placeholder="Descripción de la sección…" className={`${inputCls()} resize-none`} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Fondo</label>
              <div className="flex gap-2">
                {(['white', 'black'] as const).map(bg => (
                  <button key={bg} type="button" onClick={() => updateConfig(s.id, { bg })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${cfg.bg === bg ? 'border-black bg-black/5 font-medium' : 'border-gray-200 text-gray-500'}`}>
                    <span className={`w-3.5 h-3.5 rounded-full border ${bg === 'white' ? 'bg-white border-gray-300' : 'bg-black border-black'}`} />
                    {bg === 'white' ? 'Blanco' : 'Negro'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'featured_products': {
        const cfg = s.config as FeaturedConfig;
        const ids = cfg.productIds ?? [];
        const useFeatured = cfg.useFeatured ?? false;
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Título de la sección</label>
              <input value={cfg.title ?? ''} onChange={e => updateConfig(s.id, { title: e.target.value })}
                placeholder="Ej: Destacados" className={inputCls()} />
            </div>

            {/* Toggle: automático vs manual */}
            <div className={`flex items-center justify-between border rounded-xl px-3 py-2.5 transition-colors ${useFeatured ? 'border-amber-200 bg-amber-50/30' : 'border-gray-200'}`}>
              <div>
                <p className="text-xs font-medium text-black">Automático (productos marcados como ★ Destacado)</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Muestra hasta 4 productos con el toggle "Destacado" activado</p>
              </div>
              <button type="button"
                onClick={() => updateConfig(s.id, { useFeatured: !useFeatured })}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${useFeatured ? 'bg-amber-400' : 'bg-gray-200'}`}>
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${useFeatured ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {!useFeatured && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                  Selección manual <span className="normal-case font-normal text-gray-400">({ids.length} seleccionados)</span>
                </label>
                <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-xl p-2">
                  {products.length === 0 ? (
                    <p className="text-xs text-gray-400 p-2">No hay productos disponibles</p>
                  ) : products.map(p => {
                    const checked = ids.includes(p.id);
                    return (
                      <label key={p.id} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-colors ${checked ? 'bg-black/5' : 'hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={checked} className="w-4 h-4 accent-black"
                          onChange={e => {
                            const next = e.target.checked ? [...ids, p.id] : ids.filter(i => i !== p.id);
                            updateConfig(s.id, { productIds: next });
                          }} />
                        {p.images[0] && (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            <Image src={p.images[0]} alt={p.name} fill sizes="32px" className="object-cover" />
                          </div>
                        )}
                        <span className="text-xs line-clamp-1">{p.name}</span>
                        <span className="ml-auto text-[10px] text-gray-400 shrink-0">${p.price.toLocaleString('es-CO')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      }
      case 'lifestyle_banner': {
        const cfg = s.config as LifestyleBannerConfig;
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">Etiqueta (label)</span>
                <input value={cfg.label ?? ''} onChange={e => updateConfig(s.id, { label: e.target.value })}
                  placeholder="VERZUS LIFESTYLE" className={inputCls()} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">Fondo</span>
                <select value={cfg.bg ?? 'light'} onChange={e => updateConfig(s.id, { bg: e.target.value })}
                  className={inputCls().replace('px-3', 'px-2')}>
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400">Título</span>
              <input value={cfg.heading ?? ''} onChange={e => updateConfig(s.id, { heading: e.target.value })}
                placeholder="Para tu entrenamiento. Para tu día." className={inputCls()} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400">Descripción</span>
              <textarea rows={2} value={cfg.body ?? ''} onChange={e => updateConfig(s.id, { body: e.target.value })}
                placeholder="Versatilidad, estilo y confort en cada movimiento."
                className={inputCls() + ' resize-none'} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">Botón CTA</span>
                <input value={cfg.cta ?? ''} onChange={e => updateConfig(s.id, { cta: e.target.value })}
                  placeholder="Descubrir más" className={inputCls()} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">Link del botón</span>
                <input value={cfg.link ?? ''} onChange={e => updateConfig(s.id, { link: e.target.value })}
                  placeholder="/coleccion" className={inputCls()} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-400">Imágenes (hasta 2)</span>
              {(cfg.images ?? []).map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <Image src={img} alt={`img ${idx+1}`} fill sizes="64px" className="object-cover" />
                  </div>
                  <input value={img} onChange={e => {
                    const imgs = [...(cfg.images ?? [])]; imgs[idx] = e.target.value;
                    updateConfig(s.id, { images: imgs });
                  }} className={inputCls()} placeholder="URL de imagen" />
                  <button type="button" onClick={() => {
                    updateConfig(s.id, { images: (cfg.images ?? []).filter((_, i) => i !== idx) });
                  }} className="text-red-400 hover:text-red-600 text-xs shrink-0">Quitar</button>
                </div>
              ))}
              {(cfg.images ?? []).length < 2 && (
                <button type="button" onClick={() => {
                  const key = `${s.id}__lsimg${(cfg.images ?? []).length}`;
                  fileRefs.current[key]?.click();
                }}
                  disabled={uploading !== null}
                  className="border-2 border-dashed border-gray-200 hover:border-gray-400 text-gray-400 text-xs rounded-lg py-2 transition-colors">
                  {uploading?.startsWith(s.id + '__lsimg') ? 'Subiendo…' : '+ Agregar imagen'}
                </button>
              )}
              {[0, 1].map(idx => (
                <input key={idx}
                  ref={el => { fileRefs.current[`${s.id}__lsimg${idx}`] = el; }}
                  type="file" accept="image/*" className="hidden"
                  onChange={async e => {
                    const f = e.target.files?.[0]; if (!f) return;
                    const url = await uploadToUrl(`${s.id}__lsimg${idx}`, f);
                    if (url) { const imgs = [...(cfg.images ?? [])]; imgs[idx] = url; updateConfig(s.id, { images: imgs }); }
                    e.target.value = '';
                  }} />
              ))}
            </div>
          </div>
        );
      }

      case 'instagram_grid': {
        const cfg = s.config as InstagramGridConfig;
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400">Handle de Instagram</span>
              <input value={cfg.handle ?? ''} onChange={e => updateConfig(s.id, { handle: e.target.value })}
                placeholder="@verzus.wear" className={inputCls()} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-gray-400">Fotos (hasta 6 URLs)</span>
              {(cfg.images ?? []).map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                    <Image src={img} alt={`ig ${idx+1}`} fill sizes="48px" className="object-cover" />
                  </div>
                  <input value={img} onChange={e => {
                    const imgs = [...(cfg.images ?? [])]; imgs[idx] = e.target.value;
                    updateConfig(s.id, { images: imgs });
                  }} className={inputCls()} placeholder="URL de foto" />
                  <button type="button" onClick={() => {
                    updateConfig(s.id, { images: (cfg.images ?? []).filter((_, i) => i !== idx) });
                  }} className="text-red-400 hover:text-red-600 text-xs shrink-0">×</button>
                </div>
              ))}
              {(cfg.images ?? []).length < 6 && (
                <button type="button" onClick={() => updateConfig(s.id, { images: [...(cfg.images ?? []), ''] })}
                  className="border-2 border-dashed border-gray-200 hover:border-gray-400 text-gray-400 text-xs rounded-lg py-2 transition-colors">
                  + Agregar URL
                </button>
              )}
            </div>
          </div>
        );
      }

      case 'testimonials': {
        const cfg = s.config as TestimonialsConfig;
        const items = cfg.items ?? [];
        function updateTestimonial(idx: number, patch: Partial<TestimonialItem>) {
          const next = items.map((t, i) => i === idx ? { ...t, ...patch } : t);
          updateConfig(s.id, { items: next });
        }
        return (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">Etiqueta</span>
                <input value={cfg.label ?? ''} onChange={e => updateConfig(s.id, { label: e.target.value })}
                  placeholder="Lo que dicen nuestros clientes" className={inputCls()} />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">Título</span>
                <input value={cfg.heading ?? ''} onChange={e => updateConfig(s.id, { heading: e.target.value })}
                  placeholder="Ellas ya lo viven." className={inputCls()} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Testimonios ({items.length})
              </p>
              {items.map((t, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium">#{idx + 1}</span>
                    {items.length > 1 && (
                      <button type="button"
                        onClick={() => updateConfig(s.id, { items: items.filter((_, i) => i !== idx) })}
                        className="text-[11px] text-red-400 hover:text-red-600 transition-colors">
                        Quitar
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400">Nombre</span>
                      <input value={t.name} onChange={e => updateTestimonial(idx, { name: e.target.value })}
                        placeholder="María G." className={inputCls()} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-400">Ciudad (opcional)</span>
                      <input value={t.location ?? ''} onChange={e => updateTestimonial(idx, { location: e.target.value })}
                        placeholder="Bogotá" className={inputCls()} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-400">Reseña</span>
                    <textarea rows={2} value={t.text} onChange={e => updateTestimonial(idx, { text: e.target.value })}
                      placeholder="Increíble calidad, la tela es suave y muy cómoda..."
                      className={`${inputCls()} resize-none`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">Estrellas:</span>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} type="button" onClick={() => updateTestimonial(idx, { rating: n })}
                        className="text-lg leading-none transition-colors"
                        style={{ color: n <= (t.rating ?? 5) ? '#F59E0B' : '#E5E7EB' }}>
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {items.length < 6 && (
                <button type="button"
                  onClick={() => updateConfig(s.id, { items: [...items, { name: '', text: '', rating: 5 }] })}
                  className="border-2 border-dashed border-gray-200 hover:border-gray-400 text-gray-400 text-xs rounded-xl py-2 transition-colors">
                  + Agregar testimonio
                </button>
              )}
            </div>
          </div>
        );
      }
    }
  }

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 max-w-2xl">

      {apiError && (
        <p className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{apiError}</p>
      )}

      {/* Preset Layout Revista */}
      <div className="border border-dashed border-amber-200 bg-amber-50/40 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-amber-800">Preset: Layout Revista</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Reemplaza todas las secciones con el layout editorial premium (Hero → Colecciones → Editorial → Destacados → Texto → Carrusel → Editorial oscuro → Instagram)</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            const ok = await Swal.fire({
              title: '¿Aplicar Layout Revista?',
              text: 'Esto reemplazará todas las secciones actuales. El contenido (imágenes, categorías) deberás configurarlo después.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#000',
              cancelButtonColor: '#6b7280',
              confirmButtonText: 'Sí, aplicar',
              cancelButtonText: 'Cancelar',
            });
            if (!ok.isConfirmed) return;
            setSections([
              { id: crypto.randomUUID(), type: 'hero', enabled: true, config: { slides: [{ image: '/images/imagen_portada.png', headingLine1: 'Diseñado para moverte.', headingLine2: 'Hecho para acompañarte.', body: 'Activewear premium con identidad propia.', cta: 'Descubrir colección' }] } },
              { id: crypto.randomUUID(), type: 'collection_grid', enabled: true, config: { items: [{ title: 'Tennis', subtitle: 'Diseñada para jugar.', link: '/coleccion?categoria=Tennis' }, { title: 'Training', subtitle: 'Para tu mejor versión.', link: '/coleccion?categoria=Training' }, { title: 'Lifestyle', subtitle: 'Comodidad sin límites.', link: '/coleccion?categoria=Lifestyle' }, { title: 'Sets', subtitle: 'El look completo.', link: '/coleccion?categoria=Sets' }] } },
              { id: crypto.randomUUID(), type: 'lifestyle_banner', enabled: true, config: { label: 'Nueva temporada', heading: 'Para tu entrenamiento. Para tu día.', body: 'Piezas que se adaptan a tu ritmo, desde la primera repetición hasta el after.', cta: 'Explorar colección', link: '/coleccion', bg: 'light', images: [] } },
              { id: crypto.randomUUID(), type: 'featured_products', enabled: true, config: { useFeatured: true, productIds: [], title: 'Destacados' } },
              { id: crypto.randomUUID(), type: 'text_block', enabled: true, config: { heading: 'Ingeniería textil al servicio del movimiento.', body: 'Cada pieza Verzus está fabricada con telas de alto desempeño que respiran, se mueven contigo y mantienen su forma lavado tras lavado.', bg: 'black' } },
              { id: crypto.randomUUID(), type: 'category_carousel', enabled: true, config: { categoryName: '', maxProducts: 4 } },
              { id: crypto.randomUUID(), type: 'lifestyle_banner', enabled: true, config: { label: 'Verzus Lifestyle', heading: 'Vista la confianza.', body: 'Más que activewear: es una actitud. Diseñado para quienes no se detienen.', cta: 'Ver colección', link: '/coleccion', bg: 'dark', images: [] } },
              { id: crypto.randomUUID(), type: 'instagram_grid', enabled: true, config: { handle: '@verzus.wear', images: [] } },
            ]);
            setExpanded(new Set());
            Toast.fire({ icon: 'success', title: 'Layout Revista aplicado — configura las secciones y guarda' });
          }}
          className="shrink-0 text-xs font-semibold text-amber-800 border border-amber-300 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Aplicar preset
        </button>
      </div>

      {/* Lista de secciones */}
      <div className="flex flex-col gap-2">
        {sections.length === 0 && (
          <p className="text-sm text-gray-400 italic text-center py-8 border border-dashed border-gray-200 rounded-xl">
            No hay secciones. Agrega una usando el botón de abajo.
          </p>
        )}

        {sections.map((s, i) => {
          const meta = BLOCK_META[s.type];
          const isExpanded = expanded.has(s.id);
          const isDragging = dragIndex === i;
          const isDragOver = dragOverIndex === i;

          return (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnter={() => setDragOverIndex(i)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => {
                if (dragIndex !== null && dragIndex !== i) moveSection(dragIndex, i);
                setDragIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              className={`border rounded-xl overflow-hidden transition-all ${
                isDragging ? 'opacity-40' : ''
              } ${isDragOver && dragIndex !== null ? 'ring-2 ring-black' : ''} ${
                s.enabled ? 'border-gray-200' : 'border-gray-100 bg-gray-50/50'
              }`}
            >
              {/* Header de la card */}
              <div className="flex items-center gap-3 px-3 py-3">
                {/* Handle drag */}
                <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 shrink-0 touch-none select-none">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="9" cy="6" r="1.5" /><circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" /><circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" /><circle cx="15" cy="18" r="1.5" />
                  </svg>
                </div>

                {/* Icono + label */}
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${meta?.color ?? 'bg-gray-100 text-gray-600'}`}>
                  {meta?.icon}
                  {blockLabel(s)}
                </span>

                <div className="ml-auto flex items-center gap-2">
                  {/* Toggle ON/OFF */}
                  <button
                    type="button"
                    onClick={() => toggleEnabled(s.id)}
                    className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${s.enabled ? 'bg-black' : 'bg-gray-200'}`}
                    title={s.enabled ? 'Visible' : 'Oculto'}
                  >
                    <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${s.enabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </button>

                  {/* Expandir */}
                  <button type="button" onClick={() => toggleExpand(s.id)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors ${isExpanded ? 'bg-gray-100 text-black' : ''}`}>
                    <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Eliminar */}
                  <button type="button" onClick={() => removeSection(s.id)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Editor expandido */}
              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-4 bg-gray-50/30">
                  {renderEditor(s)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Agregar bloque */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(p => !p)}
          className="w-full border-2 border-dashed border-gray-200 hover:border-black text-gray-400 hover:text-black rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar sección
        </button>

        {showPicker && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            {(Object.entries(BLOCK_META) as [BlockType, typeof BLOCK_META[BlockType]][]).map(([type, meta]) => (
              <button
                key={type}
                type="button"
                onClick={() => addSection(type)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${meta.color}`}>
                  {meta.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-black">{meta.label}</p>
                  <p className="text-[11px] text-gray-400">{BLOCK_DESCRIPTIONS[type]}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer: guardar + ver tienda */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="bg-black hover:bg-gray-800 disabled:opacity-50 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          {saving ? 'Guardando…' : 'Guardar portada'}
        </button>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-gray-200 hover:border-black text-gray-600 hover:text-black px-5 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          Ver en la tienda
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

    </div>
  );
}
