import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import { HeroConfig } from '../types';

interface Props {
  config: HeroConfig;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
  heroY: MotionValue<number>;
  showVideoIntro: boolean;
  onCtaClick: () => void;
}

export const Hero: React.FC<Props> = ({
  config,
  opacity,
  scale,
  heroY,
  showVideoIntro,
  onCtaClick,
}) => {
  const {
    badge,
    heading,
    subtitle,
    subtitle_highlight_1,
    subtitle_highlight_2,
    cta_text,
    scroll_hint,
  } = config;

  // Build subtitle with highlighted words
  const renderedSubtitle = () => {
    if (!subtitle_highlight_1 && !subtitle_highlight_2) {
      return <span data-tooltip="Hello">{subtitle}</span>;
    }
    const parts = subtitle.split(new RegExp(`(${subtitle_highlight_1}|${subtitle_highlight_2})`, 'g'));
    return (
      <>
        {parts.map((part, i) => {
          if (part === subtitle_highlight_1) {
            return <span data-tooltip="Hello" key={i} className="text-white font-semibold">{part}</span>;
          }
          if (part === subtitle_highlight_2) {
            return <span data-tooltip="Hello" key={i} className="text-emerald-400 font-semibold">{part}</span>;
          }
          return <span data-tooltip="Hello" key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <section className="h-screen flex flex-col items-center justify-center px-6 relative">
      <motion.div
        style={{ opacity, scale, y: heroY }}
        className="text-center z-10"
        animate={{ opacity: showVideoIntro ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-8"
        >
          <Sparkles className="w-4 h-4" />
          {badge}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[4rem] font-black cinematic-text mb-8 tracking-tighter"
        >
          {heading}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-3xl text-white/80 max-w-3xl mx-auto leading-relaxed font-semibold"
        >
          {renderedSubtitle()}
        </motion.p>

        <motion.button
          onClick={onCtaClick}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold rounded-full hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {cta_text}
        </motion.button>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 flex flex-col items-center gap-2 text-white font-bold"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">{scroll_hint}</span>
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  );
};
