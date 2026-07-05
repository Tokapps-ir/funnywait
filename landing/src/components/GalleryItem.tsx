/**
 * Gallery component — masonry layout, group filter, vivid glass frames.
 *
 * Visual layers (front → back):
 *   [Glass border ring]          ← inset box-shadow + color-tinted border
 *   [Specular highlight]         ← radial-gradient tracking the cursor
 *   [Edge refraction bands]      ← IOR gradient at glass boundary
 *   [Glass tint surface]         ← vivid color-adaptive layer (NO blur — keeps image sharp)
 *   [Image]                      ← shifts slightly less than frame → parallax
 *   [Background fill]            ← solid dark fallback
 *
 * Color: saturation³-weighted extraction picks the most vivid pixel colour,
 * then a contrast punch pushes it further away from grey for bolder glass tints.
 *
 * Filtering: items can belong to multiple GalleryGroups (many-to-many).
 * Falls back to item.category string if no groups are provided.
 */

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
  LayoutGroup,
} from 'framer-motion';
import type { GalleryItem, GalleryGroup } from '../types';

const STRAPI_URL = (import.meta as any).env?.VITE_STRAPI_URL ?? 'http://127.0.0.1:1337';

// ─── Spring configs ────────────────────────────────────────────────────────────
const TILT_SPRING  = { stiffness: 280, damping: 22, mass: 0.6 };
const SHIFT_SPRING = { stiffness: 180, damping: 26, mass: 0.5 };

// ─── Color utilities ───────────────────────────────────────────────────────────
type RGB = { r: number; g: number; b: number };

const PALETTE: RGB[] = [
  { r: 16,  g: 185, b: 129 },
  { r: 245, g: 158, b: 11  },
  { r: 139, g: 92,  b: 246 },
  { r: 59,  g: 130, b: 246 },
  { r: 239, g: 68,  b: 68  },
  { r: 20,  g: 184, b: 166 },
  { r: 236, g: 72,  b: 153 },
  { r: 234, g: 179, b: 8   },
];

function urlFallbackColor(url: string): RGB {
  let h = 0;
  for (let i = 0; i < url.length; i++) h = (Math.imul(31, h) + url.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

/** Saturation³-weighted extraction — strongly prefers vivid pixels over greys. */
function extractVividColor(img: HTMLImageElement): RGB | null {
  try {
    const SIZE = 80;
    const canvas = document.createElement('canvas');
    canvas.width = SIZE; canvas.height = SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, SIZE, SIZE);
    const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

    let wr = 0, wg = 0, wb = 0, total = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const rn = r / 255, gn = g / 255, bn = b / 255;
      const max = Math.max(rn, gn, bn);
      const min = Math.min(rn, gn, bn);
      const l = (max + min) / 2;
      if (l < 0.1 || l > 0.92) continue;
      const delta = max - min;
      const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      const w = s * s * s;
      wr += r * w;
      wg += g * w;
      wb += b * w;
      total += w;
    }
    if (total < 0.5) return null;
    return { r: Math.round(wr / total), g: Math.round(wg / total), b: Math.round(wb / total) };
  } catch { return null; }
}

/** Push colour channels away from their average — makes extracted tones punchier. */
function punchColor(color: RGB, factor = 1.45): RGB {
  const avg = (color.r + color.g + color.b) / 3;
  return {
    r: Math.min(255, Math.max(0, Math.round(avg + (color.r - avg) * factor))),
    g: Math.min(255, Math.max(0, Math.round(avg + (color.g - avg) * factor))),
    b: Math.min(255, Math.max(0, Math.round(avg + (color.b - avg) * factor))),
  };
}

function buildUrl(url?: string): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

// ─── Glass Card ────────────────────────────────────────────────────────────────

interface CardProps { item: GalleryItem; index: number; onClick: () => void; }

const GalleryCard: React.FC<CardProps> = ({ item, index, onClick }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);

  const [color, setColor]     = useState<RGB>(() => urlFallbackColor(item.image?.url ?? String(item.id)));
  const [hovered, setHovered] = useState(false);

  const imageUrl = buildUrl(item.image?.url);

  const aspectRatio = useMemo(() => {
    const { width, height } = item.image ?? {};
    if (width && height) return width / height;
    const fallbacks = [4 / 3, 2 / 3, 1, 9 / 5, 3 / 4];
    return fallbacks[item.id % fallbacks.length];
  }, [item.id, item.image]);

  const handleLoad = useCallback(() => {
    if (!imgRef.current) return;
    const raw = extractVividColor(imgRef.current);
    if (raw) setColor(punchColor(raw));
  }, []);

  // ── Mouse tracking ──────────────────────────────────────────────────────────
  const mouseNX = useMotionValue(0);
  const mouseNY = useMotionValue(0);

  const rotateY = useSpring(useTransform(mouseNX, [-0.5, 0.5], [-16, 16]), TILT_SPRING);
  const rotateX = useSpring(useTransform(mouseNY, [-0.5, 0.5], [ 12, -12]), TILT_SPRING);

  const imgX = useSpring(useTransform(mouseNX, [-0.5, 0.5], [10, -10]), SHIFT_SPRING);
  const imgY = useSpring(useTransform(mouseNY, [-0.5, 0.5], [10, -10]), SHIFT_SPRING);

  const specPctX = useTransform(mouseNX, [-0.5, 0.5], [10, 90]);
  const specPctY = useTransform(mouseNY, [-0.5, 0.5], [10, 90]);
  const specularBg = useMotionTemplate`radial-gradient(ellipse 65% 65% at ${specPctX}% ${specPctY}%, rgba(255,255,255,0.28) 0%, transparent 70%)`;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseNX.set((e.clientX - rect.left) / rect.width  - 0.5);
    mouseNY.set((e.clientY - rect.top)  / rect.height - 0.5);
  }, [mouseNX, mouseNY]);

  const handleMouseLeave = useCallback(() => {
    mouseNX.set(0);
    mouseNY.set(0);
    setHovered(false);
  }, [mouseNX, mouseNY]);

  // ── Derived colour strings ──────────────────────────────────────────────────
  const { r, g, b } = color;
  const c = (a: number) => `rgba(${r},${g},${b},${a})`;

  const outerGlow = hovered
    ? `0 28px 70px rgba(0,0,0,0.65), 0 0 45px ${c(0.5)}, 0 0 2px ${c(0.7)}`
    : `0 12px 40px rgba(0,0,0,0.5),  0 0 22px ${c(0.32)}`;

  // Subtle glass tint — very low opacity so the image stays clear underneath
  const glassTint = `linear-gradient(145deg, ${c(0.08)} 0%, ${c(0.02)} 45%, ${c(0.06)} 100%)`;

  const iorBands = `
    linear-gradient(to right,
      rgba(255,255,255,0.20) 0%, transparent 7%,
      transparent 93%, rgba(255,255,255,0.12) 100%),
    linear-gradient(to bottom,
      rgba(255,255,255,0.24) 0%, transparent 9%,
      transparent 91%, rgba(0,0,0,0.14) 100%)
  `;

  const clearcoat = `radial-gradient(ellipse 90% 55% at 15% 12%, rgba(255,255,255,0.22) 0%, transparent 60%)`;

  const labelGrad = `linear-gradient(to top, ${c(0.92)} 0%, ${c(0.5)} 50%, transparent 100%)`;

  return (
    <motion.div
      ref={wrapRef}
      className="break-inside-avoid mb-3 cursor-pointer select-none"
      style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
      initial={{ opacity: 0, y: 28, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* ── Rotating card shell ── */}
      <motion.div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          aspectRatio,
          transformStyle: 'preserve-3d',
          boxShadow: outerGlow,
          transition: 'box-shadow 0.4s',
          willChange: 'transform',
        }}
      >
        {/* ① Dark fill — very subtle, image covers it */}
        <div className="absolute inset-0 rounded-2xl" style={{ background: c(0.10) }} />

        {/* ② Image — slower spring = parallax depth */}
        <motion.div
          className="absolute inset-[-8%] w-[116%] h-[116%]"
          style={{ x: imgX, y: imgY }}
        >
          {imageUrl ? (
            <img
              ref={imgRef}
              src={imageUrl}
              alt={item.title}
              crossOrigin="anonymous"
              onLoad={handleLoad}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-25">🖼️</div>
          )}
        </motion.div>

        {/* ③ Vivid glass tint — NO backdropFilter blur to keep image sharp */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: glassTint }}
        />

        {/* ④ IOR edge bands */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: iorBands }} />

        {/* ⑤ Static clearcoat highlight */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: clearcoat }} />

        {/* ⑥ Dynamic specular — tracks cursor */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: specularBg, opacity: hovered ? 1 : 0.45, transition: 'opacity 0.3s' }}
        />

        {/* ⑦ Glass frame ring — coloured border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: `1px solid ${c(0.55)}`,
            boxShadow: [
              'inset 0  1px 0 rgba(255,255,255,0.45)',
              'inset 0 -1px 0 rgba(0,0,0,0.18)',
              'inset  1px 0 0 rgba(255,255,255,0.22)',
              'inset -1px 0 0 rgba(255,255,255,0.12)',
            ].join(', '),
          }}
        />

        {/* ⑧ Label — slides up on hover */}
        <motion.div
          className="absolute inset-x-0 bottom-0 p-3 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          style={{ background: labelGrad }}
        >
          <p className="text-white font-bold text-sm leading-tight drop-shadow">{item.title}</p>
          {item.caption && (
            <p className="text-white/90 font-semibold text-xs mt-0.5 line-clamp-2">{item.caption}</p>
          )}
        </motion.div>

        {/* ⑨ Expand icon */}
        <motion.div
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.75 }}
          transition={{ duration: 0.2 }}
          style={{
            background: c(0.32),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${c(0.5)}`,
          }}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// ─── Lightbox ──────────────────────────────────────────────────────────────────

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ items, index, onClose, onNavigate }) => {
  const item     = items[index];
  const imageUrl = buildUrl(item.image?.url);

  const [color, setColor] = useState<RGB>(() => urlFallbackColor(item.image?.url ?? String(item.id)));
  const [imgKey, setImgKey] = useState(index);

  useEffect(() => {
    setColor(urlFallbackColor(item.image?.url ?? String(item.id)));
    setImgKey(index);
  }, [index, item]);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const raw = extractVividColor(e.currentTarget);
    if (raw) setColor(punchColor(raw));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose();
      if (e.key === 'ArrowLeft')  onNavigate((index - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onNavigate((index + 1) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, items.length, onClose, onNavigate]);

  const { r, g, b } = color;
  const ac = (a: number) => `rgba(${r},${g},${b},${a})`;

  const btnStyle = {
    background: ac(0.22),
    backdropFilter: 'blur(14px)',
    border: `1px solid ${ac(0.45)}`,
  };

  return (
    <motion.div
      key="lb"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/88 backdrop-blur-2xl" />

      <motion.div
        key={`ag-${index}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 75% 55% at 50% 50%, ${ac(0.22)} 0%, transparent 70%)` }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={imgKey}
          initial={{ rotateY: -80, scale: 0.72, opacity: 0 }}
          animate={{ rotateY:   0, scale: 1,    opacity: 1 }}
          exit={{    rotateY:  80, scale: 0.72, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 290, damping: 26 }}
          className="relative z-10 w-full max-w-4xl mx-16 rounded-3xl overflow-hidden"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1200px',
            boxShadow: `0 55px 120px rgba(0,0,0,0.7), 0 0 80px ${ac(0.28)}`,
            border: `1px solid ${ac(0.45)}`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {imageUrl && (
            <div className="relative">
              <img
                key={`img-${index}`}
                src={imageUrl}
                alt={item.title}
                crossOrigin="anonymous"
                onLoad={handleLoad}
                className="w-full max-h-[62vh] object-contain"
                style={{ background: ac(0.08) }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `linear-gradient(145deg, ${ac(0.12)} 0%, transparent 50%, ${ac(0.08)} 100%)`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
                }}
              />
            </div>
          )}

          <div
            className="px-6 py-5"
            style={{
              background: `linear-gradient(135deg, ${ac(0.22)}, rgba(0,0,0,0.88))`,
              backdropFilter: 'blur(24px)',
              borderTop: `1px solid ${ac(0.28)}`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                {item.caption && <p className="text-white/60 text-sm mt-1">{item.caption}</p>}
              </div>
              <span className="flex-shrink-0 text-xs font-mono px-3 py-1 rounded-full"
                style={{ color: ac(0.9), border: `1px solid ${ac(0.35)}` }}>
                {index + 1} / {items.length}
              </span>
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {items.map((it, i) => {
                const tu = buildUrl(it.image?.url);
                const active = i === index;
                return (
                  <button
                    key={it.id}
                    onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                    className="flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden transition-all duration-300 focus:outline-none"
                    style={{
                      opacity: active ? 1 : 0.42,
                      transform: active ? 'scale(1.14)' : 'scale(1)',
                      boxShadow: active ? `0 0 0 2px ${ac(0.85)}` : 'none',
                    }}
                    aria-label={it.title}
                  >
                    {tu
                      ? <img src={tu} alt={it.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full" style={{ background: ac(0.3) }} />
                    }
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {items.length > 1 && (
        <>
          <motion.button initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
            onClick={(e) => { e.stopPropagation(); onNavigate((index - 1 + items.length) % items.length); }}
            className="absolute left-4 md:left-6 z-20 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            style={btnStyle}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>

          <motion.button initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}
            onClick={(e) => { e.stopPropagation(); onNavigate((index + 1) % items.length); }}
            className="absolute right-4 md:right-6 z-20 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            style={btnStyle}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </>
      )}

      <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

// ─── Main Gallery export ───────────────────────────────────────────────────────

interface GalleryProps {
  items: GalleryItem[];
  groups?: GalleryGroup[];
}

export const Gallery: React.FC<GalleryProps> = ({ items, groups = [] }) => {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const isRTL = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';
  const allLabel = isRTL ? 'همه' : 'All';

  // Reset filter on locale switch
  useEffect(() => { setActiveFilter('all'); }, [items]);

  // Determine filter mode: use groups if provided, else fall back to item.category
  const useGroupsMode = groups.length > 0;

  // Build filter options list
  const filterOptions = useMemo((): Array<{ slug: string; label: string }> => {
    if (useGroupsMode) {
      return groups.map(g => ({ slug: g.slug, label: g.name }));
    }
    // Fallback: derive unique categories from items
    const seen = new Set<string>();
    const cats: Array<{ slug: string; label: string }> = [];
    for (const item of items) {
      if (item.category && !seen.has(item.category)) {
        seen.add(item.category);
        cats.push({ slug: item.category, label: item.category });
      }
    }
    return cats;
  }, [groups, items, useGroupsMode]);

  const showFilter = filterOptions.length > 1;

  // Filter items based on active selection
  const filtered = useMemo(() => {
    if (activeFilter === 'all') return items;
    if (useGroupsMode) {
      return items.filter(item =>
        item.gallery_groups?.some(g => g.slug === activeFilter)
      );
    }
    return items.filter(item => item.category === activeFilter);
  }, [items, activeFilter, useGroupsMode]);

  const handleCardClick = useCallback((idx: number) => setLightboxIdx(idx), []);

  return (
    <>
      {/* ── Group / Category filter tabs ── */}
      {showFilter && (
        <LayoutGroup>
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {(['all', ...filterOptions.map(f => f.slug)] as string[]).map((slug) => {
              const opt = filterOptions.find(f => f.slug === slug);
              const label = slug === 'all' ? allLabel : (opt?.label ?? slug);
              const isActive = activeFilter === slug;
              return (
                <motion.button
                  key={slug}
                  onClick={() => setActiveFilter(slug)}
                  className="relative px-5 py-2 rounded-full text-md font-semibold focus:outline-none"
                  style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.72)' }}
                  whileHover={{ color: '#fff' }}
                  transition={{ duration: 0.18 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.14)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.28)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </motion.button>
              );
            })}
          </div>
        </LayoutGroup>
      )}

      {/* ── Masonry grid with smooth group-switch animation ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1,    y: 0  }}
          exit={{    opacity: 0, scale: 0.97, y: -8  }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="columns-2 md:columns-3 lg:columns-4 gap-3"
        >
          {filtered.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={idx}
              onClick={() => handleCardClick(idx)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            items={filtered}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onNavigate={setLightboxIdx}
          />
        )}
      </AnimatePresence>
    </>
  );
};
