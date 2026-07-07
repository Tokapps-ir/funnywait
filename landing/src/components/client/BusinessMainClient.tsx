// src/components/MainPageClient.tsx
'use client';

import React, {useEffect, useState, useRef, useMemo} from 'react';
import {motion, useScroll, useTransform, AnimatePresence} from 'framer-motion';
import {ThreeScene} from '../../components/ThreeScene';
import {Calculator} from '../../components/Calculator';
import {ProductCard} from '../../components/ProductCard';
import {SmartCalculator} from '../../components/SmartCalculator';
import {SmoothScroll} from '../../components/SmoothScroll';
import {FeatureCards3D} from '../../components/FeatureCards3D';
import {FooterWebGL} from '../../components/FooterWebGL';
import {OurCustomers} from '../../components/OurCustomers';
import {OurBusinessPartners} from '../../components/OurBusinessPartners';
import {OurServices} from '../../components/OurServices';
import {VideoIntroduction} from '../../components/VideoIntroduction';
import {Hero} from '../../components/Hero';
import {Gallery} from '../../components/GalleryItem';
import {TestimonialCarousel} from '../../components/TestimonialCarousel';
import {CustomCursor} from '../../components/CustomCursor';
import {toPersianDigits} from '../../lib/helpers';
import {
    Settings,
    Product,
    CalculatorConfig,
    HeroConfig,
    FeaturesConfig,
    FeatureCard,
    Package,
    GalleryItem,
    GalleryGroup,
    Testimonial,
    getBrandLogoUrl, MainBusinessPageProps
} from '../../types';
import {LanguageContext, translations, type Locale} from '../../lib/i18n';
import {Zap, Menu, X, Quote, Star, Image as ImageIcon} from 'lucide-react';
import {Howl} from 'howler';

// --- Audio instances ---
const bgMusic = typeof window !== 'undefined' ? new Howl({
    src: ['/Musics/Back.mp3'],
    loop: true,
    volume: 0.15,
    html5: true,
    preload: true,
}) : null;

const transitionSound = typeof window !== 'undefined' ? new Howl({
    src: ['/Musics/Scroll.mp3'],
    volume: 0.19,
    html5: true,
    preload: true,
}) : null;

const resultSound = typeof window !== 'undefined' ? new Howl({
    src: ['/Musics/Success.wav'],
    volume: 0.2,
    html5: true,
    preload: true,
}) : null;

const clickSound = typeof window !== 'undefined' ? new Howl({
    src: ['/Musics/click.mp3'],
    volume: 0.2,
    html5: true,
    preload: true,
}) : null;

const successSound = typeof window !== 'undefined' ? new Howl({
    src: ['/Musics/Success.mp3'],
    volume: 0.2,
    html5: true,
    preload: true,
}) : null;

function useSectionReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            {threshold: 0.15}
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return {ref, visible};
}

const SectionReveal = ({children, className = ''}: { children: React.ReactNode; className?: string }) => {
    const {ref, visible} = useSectionReveal();
    return (
        <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''} ${className}`}>
            {children}
        </div>
    );
};

const SectionDivider = () => (
    <div className="py-8">
        <div className="section-divider"/>
    </div>
);



export default function BusinessMainClient<MainBusinessPageProps>(initialData) {
    const [locale, setLocale] = useState<Locale>('fa');
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [showVideoIntro, setShowVideoIntro] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const { settings, products, calcConfig, heroConfig, featuresConfig, featureCards, smartPackages, galleryItems, galleryGroups, testimonials } = initialData.initialData;
    let Playing = false;
    const dir = locale === 'fa' ? 'rtl' : 'ltr';
    const t = useMemo(() => {
        const dict = translations[locale];
        return (key: string) => dict[key] ?? key;
    }, [locale]);

    const i18nValue = useMemo(
        () => ({locale, setLocale, dir: dir as 'rtl' | 'ltr', t}),
        [locale, dir, t],
    );

    const {scrollYProgress} = useScroll();
    const opacity = useTransform(
        scrollYProgress,
        [heroConfig?.scroll_fade_start ?? 0, heroConfig?.scroll_fade_end ?? 0.08],
        [1, 0],
    );
    const scale = useTransform(
        scrollYProgress,
        [heroConfig?.scroll_fade_start ?? 0, heroConfig?.scroll_fade_end ?? 0.08],
        [1, heroConfig?.scroll_scale_end ?? 0.85],
    );
    const heroY = useTransform(
        scrollYProgress,
        [0, 0.1],
        [0, heroConfig?.scroll_y_end ?? -60],
    );

    useEffect(() => {
        const handleGlobalClick = () => {
            if (!Playing && bgMusic) {
                Playing = true;
                bgMusic.play();
            }
        };

        window.addEventListener('click', handleGlobalClick);

        let lastSection = 0;
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const currentSection = Math.floor(latest * 8);
            if (currentSection !== lastSection && transitionSound) {
                transitionSound.play();
                lastSection = currentSection;
            }
        });

        return () => {
            window.removeEventListener('click', handleGlobalClick);
            unsubscribe();
        };
    }, [scrollYProgress, locale]);

    const toggleMusic = () => {
        if (!bgMusic) return;
        if (isMuted) {
            if (!bgMusic.playing()) {
                setIsMuted(false);
                bgMusic.play();
            }
            bgMusic.volume(0.15);
        } else {
            setIsMuted(true);
            bgMusic.volume(0);
            bgMusic.pause();
        }
    };

    useEffect(() => {
        if (testimonials.length === 0) return;
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }, [locale, dir]);

    return (
        <LanguageContext.Provider value={i18nValue}>
            <SmoothScroll>
                <div className="relative min-h-screen">
                    <ThreeScene/>

                    {/* Navigation */}
                    <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-5 flex justify-between items-center backdrop-blur-xl bg-black/20 border-b border-white/5">
                        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            {settings?.brand_logo ? (
                                <img
                                    src={getBrandLogoUrl(settings.brand_logo)}
                                    alt={settings.brand_name}
                                    className="w-75 h-40 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                    <Zap className="text-black w-5 h-5 fill-current"/>
                                </div>
                            )}
                            <span>{settings?.brand_name}</span>
                        </div>
                        <div className="hidden md:flex gap-8 text-lg font-medium text-white">
                            <a href="#features" className="hover:text-emerald-600 transition-colors">{t('nav_features')}</a>
                            <a href="#calculator" className="hover:text-emerald-400 transition-colors">{t('nav_calculator')}</a>
                            <a href="#smart-calculator" className="hover:text-emerald-400 transition-colors">{t('nav_smart')}</a>
                            <a href="#products" className="hover:text-emerald-400 transition-colors">{t('nav_products')}</a>
                            <a href="#gallery" className="hover:text-emerald-400 transition-colors">{t('nav_gallery')}</a>
                            <a href="#testimonials" className="hover:text-emerald-400 transition-colors">{t('nav_testimonials')}</a>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-[10px] text-white/40 uppercase tracking-widest">{t('nav_music_label')}</span>
                                <span className="text-[10px] text-emerald-500 font-bold">{isMuted ? t('nav_music_off') : t('nav_music_on')}</span>
                            </div>
                            <button
                                onClick={toggleMusic}
                                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-110 active:scale-95"
                                title={t('nav_music_label')}
                            >
                                <div className="flex items-center gap-[2px] h-5 w-5 justify-center">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className={`audio-wave-bar ${isMuted ? 'muted' : 'active'}`}
                                            style={{
                                                '--wave-height': `${8 + i * 3}px`,
                                                '--wave-duration': `${0.6 + i * 0.15}s`,
                                                '--wave-delay': `${i * 0.1}s`,
                                                height: isMuted ? '3px' : `${6 + i * 2}px`,
                                            } as React.CSSProperties}
                                        />
                                    ))}
                                </div>
                            </button>
                            <button className="hidden md:block bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all">
                                {t('nav_cta')}
                            </button>

                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2.5 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white z-50"
                            >
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </nav>

                    <AnimatePresence>
                        {mobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="fixed top-[81px] left-0 right-0 z-40 md:hidden flex flex-col p-6 gap-5 backdrop-blur-2xl bg-black/40 border-b border-white/5 shadow-2xl text-white"
                            >
                                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold border-b border-white/5 pb-2 hover:text-emerald-400 transition-colors">{t('nav_features')}</a>
                                <a href="#calculator" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold border-b border-white/5 pb-2 hover:text-emerald-400 transition-colors">{t('nav_calculator')}</a>
                                <a href="#smart-calculator" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold border-b border-white/5 pb-2 hover:text-emerald-400 transition-colors">{t('nav_smart')}</a>
                                <a href="#products" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold border-b border-white/5 pb-2 hover:text-emerald-400 transition-colors">{t('nav_products')}</a>
                                <a href="#gallery" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold border-b border-white/5 pb-2 hover:text-emerald-400 transition-colors">{t('nav_gallery')}</a>
                                <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold border-b border-white/5 pb-2 hover:text-emerald-400 transition-colors">{t('nav_testimonials')}</a>
                                <button className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-emerald-500 hover:text-white transition-all mt-2">
                                    {t('nav_cta')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Hero
                        config={heroConfig}
                        opacity={opacity}
                        scale={scale}
                        heroY={heroY}
                        showVideoIntro={showVideoIntro}
                        onCtaClick={() => setShowVideoIntro(true)}
                    />

                    <VideoIntroduction
                        bgMusic={bgMusic}
                        isVisible={showVideoIntro}
                        onClose={() => setShowVideoIntro(false)}
                        video={heroConfig?.video}
                    />

                    <SectionDivider/>

                    {featureCards.length > 0 && (
                        <>
                            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                                <SectionReveal>
                                    <FeatureCards3D config={featuresConfig} cards={featureCards}/>
                                </SectionReveal>
                            </section>
                            <SectionDivider/>
                        </>
                    )}

                    {products.length > 0 && (
                        <>
                            <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
                                <SectionReveal>
                                    <div className="text-center mb-16">
                                        <h2 className="text-5xl font-black mb-4">پکیج‌های هوشمند</h2>
                                        <p className="text-white/40">انتخاب بهترین راهکار متناسب با نیاز کسب‌وکار شما</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {products.map((product, i) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{opacity: 0, y: 40}}
                                                whileInView={{opacity: 1, y: 0}}
                                                viewport={{once: true}}
                                                transition={{
                                                    delay: i * 0.15,
                                                    duration: 0.6,
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
                                            >
                                                <ProductCard product={product}/>
                                            </motion.div>
                                        ))}
                                    </div>
                                </SectionReveal>
                            </section>
                            <SectionDivider/>
                        </>
                    )}

                    {galleryItems.length > 0 && (
                        <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
                            <SectionReveal>
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl font-black mb-4 flex items-center justify-center gap-4">
                                        <ImageIcon className="text-emerald-500"/>
                                        گالری تصاویر
                                    </h2>
                                    <p className="text-white/90 font-semibold">لحظات شاد مشتریان ما</p>
                                </div>
                                <Gallery items={galleryItems} groups={galleryGroups}/>
                            </SectionReveal>
                        </section>
                    )}

                    <section id="customers" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <OurCustomers/>
                        </SectionReveal>
                    </section>

                    <SectionDivider/>

                    <section id="partners" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <OurBusinessPartners/>
                        </SectionReveal>
                    </section>

                    <SectionDivider/>

                    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <OurServices/>
                        </SectionReveal>
                    </section>

                    <SectionDivider/>

                    <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <div className="text-center mb-16">
                                <h2 className="text-5xl font-black mb-4">نظرات مشتریان</h2>
                                <p className="text-white/40 font-semibold">آنچه مشتریان درباره ما می‌گویند</p>
                            </div>
                            <TestimonialCarousel
                                testimonials={testimonials}
                                active={activeTestimonial}
                                setActive={setActiveTestimonial}
                            />
                        </SectionReveal>
                    </section>

                    <FooterWebGL/>

                    <div className="fixed inset-0 pointer-events-none z-[100] lg:block">
                        <CustomCursor/>
                    </div>
                </div>
            </SmoothScroll>
        </LanguageContext.Provider>
    );
}