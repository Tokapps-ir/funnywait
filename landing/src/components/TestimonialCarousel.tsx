import React, { useCallback, useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Quote, Star, ChevronRight, ChevronLeft } from 'lucide-react';
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
    const controls = useAnimation();
    const dragX = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') setActive((active - 1 + testimonials.length) % testimonials.length);
            if (e.key === 'ArrowRight') setActive((active + 1) % testimonials.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [active, testimonials.length, setActive]);

    const getOffset = useCallback((index: number) => {
        const offset = index - active;
        const len = testimonials.length;
        if (offset > Math.floor(len / 2)) return offset - len;
        if (offset < -Math.floor(len / 2)) return offset + len;
        return offset;
    }, [active, testimonials.length]);

    const handleDragEnd = async (_: any, info: any) => {
        const threshold = 50; // Minimum distance to trigger a slide change
        const velocity = info.velocity.x;

        // If dragged left (negative x), go next. If dragged right (positive x), go prev.
        // Note: In RTL, directions might feel reversed depending on your preference,
        // but usually swipe-left means "next item" in most UI patterns.

        if (info.offset.x < -threshold || velocity < -500) {
            // Swiped Left -> Next
            setActive((active + 1) % testimonials.length);
        } else if (info.offset.x > threshold || velocity > 500) {
            // Swiped Right -> Prev
            setActive((active - 1 + testimonials.length) % testimonials.length);
        }

        // Reset drag position smoothly
        await controls.start({ x: 0 });
    };

    if (!testimonials || testimonials.length === 0) {
        return (
            <div className="text-center text-white/60 py-12" role="status">
                <p>هنوز نظری ثبت نشده است</p>
            </div>
        );
    }

    return (
        <div className="relative w-full py-8 select-none" dir="rtl">
            {/* 3D Carousel Container with Drag Support */}
            <motion.div
                ref={containerRef}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                animate={controls}
                style={{ x: dragX }}
                whileTap={{ scale: 0.98 }}
                className="testimonial-carousel flex justify-center items-center min-h-[400px] md:min-h-[450px] relative perspective-1000 overflow-hidden px-4 cursor-grab active:cursor-grabbing"
            >
                {testimonials.map((t, i) => {
                    const adjustedOffset = getOffset(i);
                    const isActive = adjustedOffset === 0;

                    // Only render nearby items for performance
                    if (Math.abs(adjustedOffset) > 2) return null;

                    return (
                        <motion.div
                            key={t.documentId}
                            animate={{
                                x: `${adjustedOffset * 100}%`,
                                z: isActive ? 50 : -100,
                                scale: isActive ? 1 : 0.85,
                                opacity: isActive ? 1 : 0.6,
                                rotateY: adjustedOffset * -12,
                            }}
                            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            style={{
                                transformStyle: 'preserve-3d',
                                position: 'absolute',
                                width: 'min(380px, 85vw)',
                                zIndex: isActive ? 30 : 10 - Math.abs(adjustedOffset),
                            }}
                            className={`cursor-pointer ${!isActive ? 'pointer-events-none' : ''}`}
                            onClick={() => setActive(i)}
                            aria-hidden={!isActive}
                        >
                            {/* Enhanced Glass Card */}
                            <div className={`
                glass-card p-6 md:p-8 relative rounded-2xl border transition-all duration-300
                backdrop-blur-xl bg-slate-900/60 
                ${isActive
                                ? 'border-emerald-500/40 shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]'
                                : 'border-white/5 bg-slate-950/80'
                            }
              `}>
                                <Quote className="absolute top-4 left-4 w-8 h-8 text-emerald-500/20 pointer-events-none" />

                                <div className="flex gap-1 mb-4">
                                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                                        <Star key={s} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                                    ))}
                                </div>

                                <p className="text-white/80 italic mb-6 leading-relaxed text-sm md:text-base font-medium min-h-[80px]">
                                    "{t.text}"
                                </p>

                                <div className="flex items-center gap-4">
                                    {t.avatar ? (
                                        <img
                                            src={t.avatar.url.startsWith('http')
                                                ? t.avatar.url
                                                : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${t.avatar.url}`}
                                            alt={t.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/30 shrink-0"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = `https://placehold.co/100x100/10b981/ffffff?text=${t.name?.[0] || '?'}`;
                                            }}
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 text-lg shrink-0">
                                            {t.name?.[0]}
                                        </div>
                                    )}
                                    <div className="overflow-hidden">
                                        <div className="font-bold text-white truncate">{t.name}</div>
                                        <div className="text-xs text-white/50 font-semibold truncate">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Navigation Controls */}
            <div className="flex justify-center items-center gap-6 mt-8">
                <button
                    onClick={() => setActive((active - 1 + testimonials.length) % testimonials.length)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    aria-label="نظر قبلی"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Carousel dots */}
                <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                active === i ? 'bg-emerald-500 w-8' : 'bg-white/20 hover:bg-white/40 w-2'
                            }`}
                            aria-label={`رفتن به نظر ${i + 1}`}
                        />
                    ))}
                </div>

                <button
                    onClick={() => setActive((active + 1) % testimonials.length)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    aria-label="نظر بعدی"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};