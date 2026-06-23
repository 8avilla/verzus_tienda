'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import {
  HomepageSection, BlockType, HeroConfig, CarouselConfig,
  BannerConfig, TextConfig, FeaturedConfig,
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
};

const BLOCK_DESCRIPTIONS: Record<BlockType, string> = {
  hero: 'Imagen principal de la portada',
  category_carousel: 'Muestra productos de una categoría',
  image_banner: 'Franja editorial entre secciones',
  text_block: 'Sección de texto con fondo negro o blanco',
  featured_products: 'Selección manual de productos',
};

function getDefaultConfig(type: BlockType): HomepageSection['config'] {
  switch (type) {
    case 'hero': return {};
    case 'category_carousel': return { categoryName: '', maxProducts: 4 };
    case 'image_banner': return { text: '', link: '' };
    case 'text_block': return { heading: '', body: '', bg: 'black' };
    case 'featured_products': return { productIds: [], title: '' };
  }
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
        return (
          <div className="flex flex-col gap-3">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Imagen del hero</label>
            {cfg.image ? (
              <div className="flex flex-col gap-2">
                <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  <Image src={cfg.image} alt="Hero" fill sizes="400px" className="object-cover" />
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
                className="w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-gray-400 transition-colors disabled:opacity-50">
                {uploading === s.id ? <span className="text-xs">Subiendo…</span> : (
                  <>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs">Subir imagen</span>
                  </>
                )}
              </button>
            )}
            <input ref={el => { fileRefs.current[s.id] = el; }} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(s.id, f); e.target.value = ''; }} />
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
        return (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Título de la sección</label>
              <input value={cfg.title ?? ''} onChange={e => updateConfig(s.id, { title: e.target.value })}
                placeholder="Ej: Más vendidos" className={inputCls()} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">
                Productos <span className="normal-case font-normal text-gray-400">({ids.length} seleccionados)</span>
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
