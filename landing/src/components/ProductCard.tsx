/**
 * ProductCard — glass card with parallax image + morphing CTA button.
 *
 * CTA workflow:
 *   1. Button lives inline in the card (relative flow).
 *   2. On click we snapshot its exact viewport rect, hide the original,
 *      and render a "morph clone" at the same fixed coords.
 *   3. The clone spring-animates to an 80 vh centered glass panel.
 *   4. On close, the clone shrinks back to the saved rect, then unmounts.
 *
 * The expanded glass panel uses the same multi-layer recipe as Gallery:
 *   specular highlight, IOR edge bands, clearcoat, tinted surface,
 *   coloured border ring — all cursor-tracked with parallax shift.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { createPortal } from 'react-dom';
import { Product } from '../types';
import { ShoppingCart, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { getStrapiMediaUrl } from '../lib/helpers';

// ─── spring configs (same as Gallery) ────────────────────────────────────────
const TILT_SPRING  = { stiffness: 260, damping: 24, mass: 0.6 };
const SHIFT_SPRING = { stiffness: 160, damping: 28, mass: 0.5 };

// ─── emerald colour for glass tint ───────────────────────────────────────────
const EC = { r: 16, g: 185, b: 129 };
const ec = (a: number) => `rgba(${EC.r},${EC.g},${EC.b},${a})`;

interface Props { product: Product; }

// ─── Simple Markdown renderer ────────────────────────────────────────────────
function renderMarkdown(md: string): React.ReactNode[] {
  return md.split('\n').map((line, i) => {
    const t = line.trim();
    if (!t) return <br key={i} />;
    if (t.startsWith('### '))
      return <h4 key={i} className="text-lg font-bold text-emerald-400 mt-6 mb-2">{inline(t.slice(4))}</h4>;
    if (t.startsWith('## '))
      return <h3 key={i} className="text-2xl font-black text-white mt-4 mb-3">{inline(t.slice(3))}</h3>;
    if (t.startsWith('# '))
      return <h2 key={i} className="text-3xl font-black text-white mb-4">{inline(t.slice(2))}</h2>;
    if (t.startsWith('- '))
      return (
        <div key={i} className="flex items-start gap-2 text-sm text-white/80 my-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{inline(t.slice(2))}</span>
        </div>
      );
    return <p key={i} className="text-white/70 text-sm leading-relaxed my-1">{inline(t)}</p>;
  });
}
function inline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i} className="text-white font-bold">{p.slice(2, -2)}</strong>
      : p,
  );
}

// ─── Parallax Image ──────────────────────────────────────────────────────────
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const imgX = useTransform(mx, [-1, 1], [12, -12]);
  const imgY = useTransform(my, [-1, 1], [12, -12]);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width  - 0.5) * 2);
    my.set(((e.clientY - r.top)  / r.height - 0.5) * 2);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <div ref={ref} className="relative h-48 overflow-hidden" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.img
        src={src} alt={alt}
        className="w-[calc(100%+24px)] h-[calc(100%+24px)] object-cover -ml-3 -mt-3"
        style={{ x: imgX, y: imgY }}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent opacity-60" />
      <div className="absolute bottom-4 right-4">
        <span className="bg-emerald-500 text-black text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">ویژه</span>
      </div>
    </div>
  );
}

// ─── Morphing Glass Panel (portal) ───────────────────────────────────────────

interface Rect { top: number; left: number; width: number; height: number; }

function MorphGlass({
  product,
  origin,
  onClose,
}: {
  product: Product;
  origin: Rect;
  onClose: () => void;
}) {
  const { title, long_description, shop_url, price, image, description: desc } = product;
  const imgUrl = getStrapiMediaUrl(image?.url);

  // ── target rect (centred 80 vh) ────────────────────────────────────────────
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const tW = Math.min(720, vw - 32);
  const tH = vh * 0.8;
  const tL = (vw - tW) / 2;
  const tT = (vh - tH) / 2;

  // ── parallax on expanded panel ─────────────────────────────────────────────
  const mouseNX = useMotionValue(0);
  const mouseNY = useMotionValue(0);

  const rotateY = useSpring(useTransform(mouseNX, [-0.5, 0.5], [-6, 6]),  TILT_SPRING);
  const rotateX = useSpring(useTransform(mouseNY, [-0.5, 0.5], [4, -4]), TILT_SPRING);
  const shiftX  = useSpring(useTransform(mouseNX, [-0.5, 0.5], [8, -8]), SHIFT_SPRING);
  const shiftY  = useSpring(useTransform(mouseNY, [-0.5, 0.5], [8, -8]), SHIFT_SPRING);

  // specular highlight tracking cursor
  const specPctX  = useTransform(mouseNX, [-0.5, 0.5], [10, 90]);
  const specPctY  = useTransform(mouseNY, [-0.5, 0.5], [10, 90]);
  const specularBg = useMotionTemplate`radial-gradient(ellipse 55% 55% at ${specPctX}% ${specPctY}%, rgba(255,255,255,0.22) 0%, transparent 70%)`;

  const panelRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const r = panelRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseNX.set((e.clientX - r.left) / r.width  - 0.5);
    mouseNY.set((e.clientY - r.top)  / r.height - 0.5);
  }, [mouseNX, mouseNY]);

  const handleLeave = useCallback(() => {
    mouseNX.set(0);
    mouseNY.set(0);
  }, [mouseNX, mouseNY]);

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ── Glass layers ───────────────────────────────────────────────────────────
  const glassTint = `linear-gradient(145deg, ${ec(0.10)} 0%, ${ec(0.03)} 45%, ${ec(0.07)} 100%)`;
  const iorBands = `
    linear-gradient(to right,
      rgba(255,255,255,0.18) 0%, transparent 6%,
      transparent 94%, rgba(255,255,255,0.10) 100%),
    linear-gradient(to bottom,
      rgba(255,255,255,0.20) 0%, transparent 8%,
      transparent 92%, rgba(0,0,0,0.12) 100%)`;
  const clearcoat = `radial-gradient(ellipse 90% 55% at 15% 12%, rgba(255,255,255,0.18) 0%, transparent 60%)`;
  const borderRing = [
    `1px solid ${ec(0.45)}`,
  ];
  const innerShadow = [
    'inset 0  1px 0 rgba(255,255,255,0.40)',
    'inset 0 -1px 0 rgba(0,0,0,0.15)',
    'inset  1px 0 0 rgba(255,255,255,0.18)',
    'inset -1px 0 0 rgba(255,255,255,0.10)',
  ].join(', ');
  const outerGlow = `0 32px 80px rgba(0,0,0,0.6), 0 0 50px ${ec(0.35)}, 0 0 2px ${ec(0.6)}`;

  // ── spring transition (FLIP) ───────────────────────────────────────────────
  const springTransition = {
    type: 'spring' as const,
    stiffness: 220,
    damping: 28,
    mass: 0.9,
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60"
        style={{ backdropFilter: 'blur(8px)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      {/* morph container — animates from button rect to panel rect */}
      <motion.div
        ref={panelRef}
        className="fixed overflow-hidden"
        style={{
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        initial={{
          top: origin.top,
          left: origin.left,
          width: origin.width,
          height: origin.height,
          borderRadius: 12,
        }}
        animate={{
          top: tT,
          left: tL,
          width: tW,
          height: tH,
          borderRadius: 24,
        }}
        exit={{
          top: origin.top,
          left: origin.left,
          width: origin.width,
          height: origin.height,
          borderRadius: 12,
        }}
        transition={springTransition}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/* ── Rotating glass shell (tilt + parallax) ── */}
        <motion.div
          className="relative w-full h-full rounded-[inherit] overflow-hidden"
          style={{
            rotateX,
            rotateY,
            transformStyle: 'preserve-3d',
            boxShadow: outerGlow,
            willChange: 'transform',
          }}
        >
          {/* ① Dark fill */}
          <div className="absolute inset-0 rounded-[inherit]" style={{ background: ec(0.08) }} />

          {/* ② Content layer — shifts for parallax depth */}
          <motion.div
            className="absolute inset-0 overflow-y-auto overflow-x-hidden"
            style={{ x: shiftX, y: shiftY }}
          >
            {/* Header image */}
            {imgUrl && (
              <div className="relative h-48 shrink-0 overflow-hidden">
                <img src={imgUrl} alt={title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 right-6">
                  <h2 className="text-3xl font-black text-white drop-shadow-lg">{title}</h2>
                  <span className="text-emerald-400 font-bold text-sm">{price}</span>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="p-8">
              {!imgUrl && (
                <div className="mb-6">
                  <h2 className="text-3xl font-black text-white">{title}</h2>
                  <span className="text-emerald-400 font-bold">{price}</span>
                </div>
              )}

              {long_description
                ? <div className="prose-invert">{renderMarkdown(long_description)}</div>
                : <p className="text-white/70">{desc}</p>
              }

              {/* Buy link */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <a
                  href={shop_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 rounded-xl font-black text-lg hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  <ShoppingCart className="w-5 h-5" />
                  خرید و فعال‌سازی
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* ③ Glass tint surface — low opacity, keeps content readable */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: glassTint }} />

          {/* ④ IOR edge refraction bands */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: iorBands }} />

          {/* ⑤ Clearcoat highlight */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: clearcoat }} />

          {/* ⑥ Dynamic specular — tracks cursor */}
          <motion.div className="absolute inset-0 pointer-events-none rounded-[inherit]" style={{ background: specularBg }} />

          {/* ⑦ Coloured border ring */}
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{ border: borderRing[0], boxShadow: innerShadow }}
          />

          {/* Close button — on top of everything */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-20 p-2.5 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: ec(0.25),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${ec(0.45)}`,
            }}
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </motion.div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}

// ─── Product Card ────────────────────────────────────────────────────────────
export const ProductCard: React.FC<Props> = ({ product }) => {
  const { title, description, features, price, image } = product;

  const [phase, setPhase] = useState<'closed' | 'open'>('closed');
  const [savedRect, setSavedRect] = useState<Rect | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const imgUrl = getStrapiMediaUrl(image?.url);

  const handleOpen = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setSavedRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    setPhase('open');
  }, []);

  const handleClose = useCallback(() => {
    // re-snapshot in case user scrolled while modal was open
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setSavedRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    }
    setPhase('closed');
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ y: -10 }}
        className="overflow-hidden flex flex-col h-full group bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl"
      >
        {imgUrl && <ParallaxImage src={imgUrl} alt={title} />}

        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-2xl font-bold mb-3">{title}</h3>
          <p className="text-white/80 text-sm mb-6 line-clamp-2">{description}</p>

          <div className="space-y-3 mb-8 flex-grow">
            {features.split('،').map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-white/90">{f.trim()}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
              <span className="text-xs text-white/40">هزینه اشتراک</span>
              <span className="text-xl font-black text-emerald-400">{price}</span>
            </div>

            {/* CTA button — the morph origin */}
            <motion.button
              ref={btnRef}
              onClick={handleOpen}
              className="w-full relative overflow-hidden py-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(16,185,129,0.15) 100%)`,
                color: '#000',
                border: `1px solid ${ec(0.3)}`,
                boxShadow: `0 4px 20px ${ec(0.15)}, inset 0 1px 0 rgba(255,255,255,0.6)`,
              }}
              whileHover={{ scale: 1.03, boxShadow: `0 8px 30px ${ec(0.3)}, inset 0 1px 0 rgba(255,255,255,0.8)` }}
              whileTap={{ scale: 0.97 }}
            >
              {/* shimmer sweep */}
              <motion.div
                className="absolute inset-0 -skew-x-12"
                style={{ background: `linear-gradient(to right, transparent 0%, ${ec(0.25)} 50%, transparent 100%)` }}
                animate={{ x: ['-120%', '220%'] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
              />
              <ShoppingCart className="w-5 h-5 relative z-10" />
              <span className="relative z-10">مشاهده و خرید</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Morph glass — portal to body */}
      <AnimatePresence>
        {phase === 'open' && savedRect && (
          <MorphGlass
            key="morph"
            product={product}
            origin={savedRect}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>
    </>
  );
};
