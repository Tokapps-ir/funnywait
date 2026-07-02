/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useEffect, useState, useRef, useMemo} from 'react';
import {motion, useScroll, useTransform, AnimatePresence} from 'framer-motion';
import {ThreeScene} from './components/ThreeScene';
import {Calculator} from './components/Calculator';
import {ProductCard} from './components/ProductCard';
import {SmartCalculator} from './components/SmartCalculator';
import {SmoothScroll} from './components/SmoothScroll';
import {FeatureCards3D} from './components/FeatureCards3D';
import {FooterWebGL} from './components/FooterWebGL';
import {OurCustomers} from './components/OurCustomers';
import {OurBusinessPartners} from './components/OurBusinessPartners';
import {OurServices} from './components/OurServices';
import {VideoIntroduction} from './components/VideoIntroduction';
import {Hero} from './components/Hero';
import {Gallery} from './components/GalleryItem';
import {TestimonialCarousel} from './components/TestimonialCarousel';
import {CustomCursor} from './components/CustomCursor';
import {getProducts} from './lib/productService';
import {getCalculatorConfig} from './lib/calculatorService';
import {getHeroConfig} from './lib/heroService';
import {getFeaturesConfig} from './lib/featuresService';
import {getFeatureCards} from './lib/featureCardService';
import {getSmartPackages} from './lib/smartPackageService';
import {getGalleryItems, getGalleryGroups} from './lib/galleryService';
import {getTestimonials} from './lib/testimonialService';
import {toPersianDigits} from './lib/helpers';
import {
    Product,
    CalculatorConfig,
    HeroConfig,
    FeaturesConfig,
    FeatureCard,
    SmartPackage,
    Package,
    GalleryItem,
    GalleryGroup,
    Testimonial
} from './types';
import {LanguageContext, translations, type Locale} from './lib/i18n';
import {Zap} from 'lucide-react';
import {Howl} from 'howler';
import {Quote, Star, Image as ImageIcon} from 'lucide-react';

// --- Audio instances ---
// Use reliable CDN sources for audio
const bgMusic = new Howl({
    src: ['/Musics/Back.mp3',],
    loop: true,
    volume: 0.15,
    html5: true,
    preload: true,
    // autoplay: true,
});

const transitionSound = new Howl({
    src: ['/Musics/Scroll.mp3'],
    volume: 0.19,
    html5: true,
    preload: true,
});

const resultSound = new Howl({
    src: ['/Musics/Success.wav'],
    volume: 0.2,
    html5: true,
    preload: true,
});

const clickSound = new Howl({
    src: ['/Musics/click.mp3'],
    volume: 0.2,
    html5: true,
    preload: true,
});


const successSound = new Howl({
    src: ['/Musics/Success.mp3'],
    volume: 0.2,
    html5: true,
    preload: true,
});


// const whooshSound = new Howl({
//   src: ['/Musics/Back.mp3'],
//   volume: 0.08,
//   html5: true,
//   preload: true,
// });

// --- Section reveal hook ---
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
                    // whooshSound.play();
                }
            },
            {threshold: 0.15}
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return {ref, visible};
}

// --- Section Reveal wrapper ---
const SectionReveal = ({children, className = ''}: { children: React.ReactNode; className?: string }) => {
    const {ref, visible} = useSectionReveal();
    return (
        <div ref={ref} className={`section-reveal ${visible ? 'visible' : ''} ${className}`}>
            {children}
        </div>
    );
};

// --- Section Divider ---
const SectionDivider = () => (
    <div className="py-8">
        <div className="section-divider"/>
    </div>
);

export default function App() {

    const [locale, setLocale] = useState<Locale>('fa');
    const [products, setProducts] = useState<Product[]>([]);
    const [calcConfig, setCalcConfig] = useState<CalculatorConfig | null>(null);
    const [heroConfig, setHeroConfig] = useState<HeroConfig | null>(null);
    const [featuresConfig, setFeaturesConfig] = useState<FeaturesConfig | null>(null);
    const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
    const [smartPackages, setSmartPackages] = useState<Package[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [galleryGroups, setGalleryGroups] = useState<GalleryGroup[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    var [isMuted, setIsMuted] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [showVideoIntro, setShowVideoIntro] = useState(false);
    var Playing=false;
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



        window.addEventListener('click', () => {
            // Attempt to play
            if (!Playing){
                Playing=true;
                bgMusic.play();
            }
        });


        const fetchData = async () => {
            setLoading(true);
            const [prodRes, calcRes, heroRes, featuresConfigRes, featureCardsRes, smartPkgRes, galleryRes, galleryGroupsRes, testimonialsRes] = await Promise.all([
                getProducts(locale),
                getCalculatorConfig(locale),
                getHeroConfig(locale),
                getFeaturesConfig(locale),
                getFeatureCards(locale),
                getSmartPackages(locale),
                getGalleryItems(locale),
                getGalleryGroups(locale),
                getTestimonials(locale),
            ]);
            // @ts-ignore
            setProducts(prodRes?.data ?? []);
            setCalcConfig(calcRes?.data ?? null);
            setHeroConfig(heroRes?.data ?? null);
            setFeaturesConfig(featuresConfigRes?.data ?? null);
            // @ts-ignore
            setFeatureCards(featureCardsRes?.data ?? []);
            // @ts-ignore
            setGalleryItems(galleryRes?.data ?? []);
            // @ts-ignore
            setGalleryGroups(galleryGroupsRes?.data ?? []);
            setTestimonials(testimonialsRes?.data ?? []);


            const mapped = (smartPkgRes?.data ?? [])
                // @ts-ignore
                .filter((sp: SmartPackage) => sp.package_key && sp.name)
                .map((sp: SmartPackage) => ({
                    id: sp.package_key,
                    name: sp.name,
                    products: sp.products?.split('\n').filter(Boolean) ?? [],
                    advantage: sp.advantage ?? '',
                    responseTime: sp.response_time ?? '',
                    priceRange: sp.price_range ?? '',
                    minBudget: sp.min_budget ?? 0,
                }));
            if (mapped.length > 0) setSmartPackages(mapped);
            setLoading(false);
        };
        fetchData();


        let lastSection = 0;
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const currentSection = Math.floor(latest * 8);
            if (currentSection !== lastSection) {
                transitionSound.play();
                lastSection = currentSection;
            }
        });

        return () => {
            unsubscribe();
        };
    }, [scrollYProgress, isMuted, locale]);

    const toggleMusic = () => {
        if (isMuted) {
            // If not loaded or not playing, try to play
            if (!bgMusic.playing()) {
                console.log('bgMusic.playing on toggle');
                setIsMuted(false);
                isMuted = false;
                bgMusic.play();
            }
            bgMusic.volume(0.15);
        } else {
            setIsMuted(true);
            isMuted = true;
            bgMusic.volume(0);
            bgMusic.pause();
        }
    };

    // Auto-rotate testimonials
    useEffect(() => {
        if (testimonials.length === 0) return;
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    // Keep html[dir] in sync with locale — must be before any early return
    useEffect(() => {
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', locale);
    }, [locale, dir]);

    if (loading || !heroConfig || !calcConfig) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-[#050505] text-white">
                <motion.div
                    animate={{opacity: [0.4, 1, 0.4], scale: [0.98, 1, 0.98]}}
                    transition={{duration: 2, repeat: Infinity}}
                    className="text-2xl font-black tracking-widest"
                >
                    {t('loading')}
                </motion.div>
            </div>
        );
    }

    return (
        <LanguageContext.Provider value={i18nValue}>
            <SmoothScroll>
                <div className="relative min-h-screen">
                    <ThreeScene/>

                    {/* Navigation */}
                    <nav
                        className="fixed top-0 left-0 right-0 z-50 px-8 py-5 flex justify-between items-center backdrop-blur-xl bg-black/20 border-b border-white/5">
                        <div className="text-2xl font-black tracking-tighter flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Zap className="text-black w-5 h-5 fill-current"/>
                            </div>
                            <span>{heroConfig.heading}</span>
                        </div>
                        <div className="hidden md:flex gap-8 text-sm font-medium text-white/60">
                            <a href="#features"
                               className="hover:text-emerald-400 transition-colors">{t('nav_features')}</a>
                            <a href="#calculator"
                               className="hover:text-emerald-400 transition-colors">{t('nav_calculator')}</a>
                            <a href="#smart-calculator"
                               className="hover:text-emerald-400 transition-colors">{t('nav_smart')}</a>
                            <a href="#products"
                               className="hover:text-emerald-400 transition-colors">{t('nav_products')}</a>
                            <a href="#gallery"
                               className="hover:text-emerald-400 transition-colors">{t('nav_gallery')}</a>
                            <a href="#testimonials"
                               className="hover:text-emerald-400 transition-colors">{t('nav_testimonials')}</a>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Language toggle */}
                            <button
                                onClick={() => setLocale(locale === 'fa' ? 'en' : 'fa')}
                                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all"
                            >
                                {t('lang_switch')}
                            </button>
                            <div className="hidden lg:flex flex-col items-end">
                                <span
                                    className="text-[10px] text-white/40 uppercase tracking-widest">{t('nav_music_label')}</span>
                                <span
                                    className="text-[10px] text-emerald-500 font-bold">{isMuted ? t('nav_music_off') : t('nav_music_on')}</span>
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
                            <button
                                className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all">
                                {t('nav_cta')}
                            </button>
                        </div>
                    </nav>

                    {/* Hero Section — driven by Strapi HeroConfig */}

                    <Hero
                        config={heroConfig}
                        opacity={opacity}
                        scale={scale}
                        heroY={heroY}
                        showVideoIntro={showVideoIntro}
                        onCtaClick={() => setShowVideoIntro(true)}
                    />

                    {/* Video Introduction Component */}
                    <VideoIntroduction
                        bgMusic={bgMusic}
                        isVisible={showVideoIntro}
                        onClose={() => setShowVideoIntro(false)}
                    />

                    <SectionDivider/>


                    {/* Features - 3D Canvas Cards — driven by Strapi FeaturesConfig + FeatureCards */}
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

                    {/* Calculator Section */}
                    {false && (
                        <>
                            <SectionReveal>
                                <div id="calculator">
                                    <Calculator config={calcConfig} resultSound={resultSound} clickSound={clickSound}/>
                                </div>
                            </SectionReveal>

                            <SectionDivider/>

                            <SectionReveal>
                                <div id="smart-calculator">
                                    <SmartCalculator clickSound={clickSound} successSound={successSound}/>
                                </div>
                            </SectionReveal>

                            <SectionDivider/>
                        </>
                    )}




                    {/* Products Section */}
                    {products.length > 0 && (
                        <>
                            <section id="products" className="py-24 px-6 max-w-7xl mx-auto">
                                <SectionReveal>
                                    <div className="text-center mb-16">
                                        <h2 className="text-5xl font-black mb-4">پکیج‌های هوشمند</h2>
                                        <p className="text-white/40">انتخاب بهترین راهکار متناسب با نیاز کسب‌وکار شما</p>
                                    </div>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {products
                                            .map((product, i) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{opacity: 0, y: 40}}
                                                whileInView={{opacity: 1, y: 0}}
                                                viewport={{once: true}}
                                                transition={{delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
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

                    {/* 3D Gallery Section */}
                    {galleryItems.length > 0 && (
                        <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
                            <SectionReveal>
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl font-black mb-4 flex items-center justify-center gap-4">
                                        <ImageIcon className="text-emerald-500"/>
                                        گالری تصاویر
                                    </h2>
                                    <p className="text-white/40">لحظات شاد مشتریان ما</p>
                                </div>
                                <Gallery items={galleryItems} groups={galleryGroups}/>
                            </SectionReveal>
                        </section>
                    )}

                    {/* Our Customers Section */}
                    <section id="customers" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <OurCustomers/>
                        </SectionReveal>
                    </section>

                    <SectionDivider/>

                    {/* Our Business Partners Section */}
                    <section id="partners" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <OurBusinessPartners/>
                        </SectionReveal>
                    </section>

                    <SectionDivider/>

                    {/* Our Services Section */}
                    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <OurServices/>
                        </SectionReveal>
                    </section>

                    <SectionDivider/>

                    {/* Testimonials Section - 3D Carousel */}
                    <section id="testimonials" className="py-24 px-6 max-w-7xl mx-auto">
                        <SectionReveal>
                            <div className="text-center mb-16">
                                <h2 className="text-5xl font-black mb-4">نظرات مشتریان</h2>
                                <p className="text-white/40">آنچه مشتریان درباره ما می‌گویند</p>
                            </div>
                            <TestimonialCarousel
                                testimonials={testimonials}
                                active={activeTestimonial}
                                setActive={setActiveTestimonial}
                            />
                        </SectionReveal>
                    </section>

                    {/* WebGL Footer */}
                    <FooterWebGL/>

                    {/* Custom Cursor Effect */}
                    <div className="fixed inset-0 pointer-events-none z-[100] lg:block">
                        <CustomCursor/>
                    </div>
                </div>
            </SmoothScroll>
        </LanguageContext.Provider>
    );
}
