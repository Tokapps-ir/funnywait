import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  active: number;
  setActive: (i: number) => void;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  active,
  setActive,
}) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center text-white/60 py-12">
        <p>هنوز نظری ثبت نشده است</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 3D Carousel */}
      <div className="testimonial-carousel flex justify-center items-center min-h-[320px] relative">
        {testimonials.map((t, i) => {
          const offset = i - active;
          // wrap around
          const adjustedOffset = offset > 1 ? offset - 3 : offset < -1 ? offset + 3 : offset;

          return (
            <motion.div
              key={t.documentId}
              animate={{
                x: adjustedOffset * 340,
                z: adjustedOffset === 0 ? 50 : -30,
                scale: adjustedOffset === 0 ? 1.05 : 0.85,
                opacity: adjustedOffset === 0 ? 1 : 0.5,
                rotateY: adjustedOffset * -15,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ transformStyle: 'preserve-3d', position: 'absolute' }}
              className={`w-[320px] md:w-[380px] cursor-pointer ${adjustedOffset === 0 ? 'z-10' : 'z-0'}`}
              onClick={() => setActive(i)}
            >
              <div className={`glass-card p-8 relative transition-all duration-300 ${adjustedOffset === 0 ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/5' : ''}`}>
                <Quote className="absolute top-4 left-4 w-8 h-8 text-emerald-500/20" />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-white/70 italic mb-6 leading-loose text-sm">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  {t.avatar ? (
                    <img
                      src={t.avatar.url.startsWith('http') ? t.avatar.url : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${t.avatar.url}`}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/100x100/10b981/ffffff?text=' + t.name[0];
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500">
                      {t.name}
                    </div>
                  )}
                  <div>
                    <div className="font-bold">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Carousel dots */}
      <div className="flex justify-center gap-3 mt-12">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              active === i ? 'bg-emerald-500 w-8' : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};