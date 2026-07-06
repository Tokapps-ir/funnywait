import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Handshake, MapPin, Calendar } from 'lucide-react';
import { getBusinessPartners } from '../lib/businessPartnerService';
import { BusinessPartner } from '../types';

interface LogoItem {
    partner: BusinessPartner;
    id: string;
    randomGlowDelay: number;
}

export const OurBusinessPartners: React.FC = () => {
    const [partners, setPartners] = useState<BusinessPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState<BusinessPartner | null>(null);

    // Track dynamic grid columns based on container sizing
    const containerRef = useRef<HTMLDivElement>(null);
    const [dynamicCols, setDynamicCols] = useState<number>(12); // Safe fallback default

    const ROWS = 4;
    const TILE_WIDTH_APPROX = 80; // Targeting ~80px width grids

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getBusinessPartners('fa');
                setPartners(response.data);
            } catch (error) {
                console.error('Error fetching business partners:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate columns on resize to remove any overflow/scrollbars
    useEffect(() => {
        if (loading) return;

        const handleResize = () => {
            if (containerRef.current) {
                const width = containerRef.current.getBoundingClientRect().width;
                // Calculate ideal column count fitting perfectly in the container
                const calculatedCols = Math.floor(width / TILE_WIDTH_APPROX);
                // Guarantee at least 1 column to avoid division/loop issues
                setDynamicCols(Math.max(calculatedCols, 1));
            }
        };

        // Initial compute
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [loading]);

    // Keeps your tiling strategy completely intact to cover the full canvas grid dynamically
    const shuffledLogoItems = useMemo(() => {
        if (partners.length === 0) return [];

        const items: LogoItem[] = [];
        const totalCells = ROWS * dynamicCols;

        for (let i = 0; i < totalCells; i++) {
            const partnerIndex = i % partners.length;
            items.push({
                partner: partners[partnerIndex],
                id: `logo-${i}`,
                randomGlowDelay: Math.random() * 10,
            });
        }

        // Fisher-Yates Shuffle
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }
        return items;
    }, [partners, dynamicCols]);

    const navigatePartner = (direction: number) => {
        if (!selectedPartner || partners.length === 0) return;
        const currentIndex = partners.findIndex(p => p.documentId === selectedPartner.documentId);
        const newIndex = (currentIndex + direction + partners.length) % partners.length;
        setSelectedPartner(partners[newIndex]);
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (!selectedPartner) return;
            if (e.key === 'Escape') setSelectedPartner(null);
            else if (e.key === 'ArrowRight') navigatePartner(1);
            else if (e.key === 'ArrowLeft') navigatePartner(-1);
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedPartner, partners]);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                    <Handshake className="w-8 h-8 text-blue-400 animate-spin"/>
                    <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent break-words">
                        همکاران تجاری ما
                    </h2>
                </div>
                <p className="text-white/70 text-lg">در حال بارگذاری...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center gap-3 mb-4">
                    <Handshake className="w-8 h-8 text-blue-400"/>
                    <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent break-words">
                        همکاران تجاری ما
                    </h2>
                </div>
                <p className="text-white/60 text-lg max-w-2xl font-semibold mx-auto">
                    لیستی از همکاران تجاری ارزشمند در سراسر کشور
                </p>
            </motion.div>

            {/* Static Canvas Wrapper - bound strictly inside with overflow-hidden to stop horizontal jumping */}
            <div
                ref={containerRef}
                className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10"
            >
                <div
                    className="grid w-full animate-fade-in"
                    style={{
                        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                        gridTemplateColumns: `repeat(${dynamicCols}, minmax(0, 1fr))`
                    }}
                >
                    {shuffledLogoItems.map((item) => (
                        <LogoCell
                            key={item.id}
                            item={item}
                            onSelect={() => setSelectedPartner(item.partner)}
                        />
                    ))}
                </div>
            </div>

            {/* Glass Modal */}
            <AnimatePresence>
                {selectedPartner && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                        onClick={() => setSelectedPartner(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button - Handled relative to container edge correctly with RTL layout contexts */}
                            <button
                                onClick={() => setSelectedPartner(null)}
                                className="absolute top-4 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                            >
                                <X className="w-5 h-5 text-white"/>
                            </button>

                            {/* Left Navigation Button */}
                            <button
                                onClick={() => navigatePartner(-1)}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                            >
                                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                            </button>

                            {/* Right Navigation Button */}
                            <button
                                onClick={() => navigatePartner(1)}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-20"
                            >
                                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white"/>
                            </button>

                            {/* Protected content view padding via px-12 sm:px-16 preventing text collision */}
                            <div className="p-6 pt-16 sm:p-10 sm:pt-12 px-12 sm:px-16" dir="rtl">
                                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 sm:gap-6 mb-6">
                                    <div className="w-24 h-24 shrink-0 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border-2 border-blue-400/30 overflow-hidden">
                                        {selectedPartner.logo?.url && (
                                            <img
                                                src={selectedPartner.logo.url.startsWith('http') ? selectedPartner.logo.url : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${selectedPartner.logo.url}`}
                                                alt={selectedPartner.name}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-white text-xl sm:text-2xl mb-1 break-words">{selectedPartner.name}</h3>
                                        <p className="text-blue-400 font-semibold break-words">{selectedPartner.company}</p>
                                    </div>
                                </div>

                                <p className="text-white/70 mb-6 leading-relaxed text-sm sm:text-base break-words">{selectedPartner.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <MapPin className="w-4 h-4 shrink-0"/>
                                        <span className="text-sm sm:text-base truncate">{selectedPartner.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Calendar className="w-4 h-4 shrink-0"/>
                                        <span className="text-sm sm:text-base truncate">از {selectedPartner.since}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/* ==========================================================================
   Logo Cell Component (Refactored)
   ========================================================================== */
interface LogoCellProps {
    item: LogoItem;
    onSelect: () => void;
}

const LogoCell: React.FC<LogoCellProps> = ({ item, onSelect }) => {
    const [isRandomlyGlowing, setIsRandomlyGlowing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const startGlow = () => {
            setIsRandomlyGlowing(true);
            setTimeout(() => setIsRandomlyGlowing(false), 2500);
        };

        const initialDelay = item.randomGlowDelay * 1000;
        const timeout = setTimeout(startGlow, initialDelay);
        const interval = setInterval(startGlow, 10000 + Math.random() * 5000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [item.randomGlowDelay]);

    const logoUrl = item.partner.logo?.url
        ? item.partner.logo.url.startsWith('http')
            ? item.partner.logo.url
            : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${item.partner.logo.url}`
        : null;

    const isActive = isRandomlyGlowing || isHovered;

    return (
        <motion.div
            className="relative aspect-square flex items-center justify-center cursor-pointer overflow-hidden border border-white/5 bg-white/[0.01]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.08, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.03)' }}
            onClick={onSelect}
        >
            {logoUrl && (
                <div
                    className="absolute inset-2 transition-all duration-700 ease-in-out"
                    style={{
                        backgroundImage: `url(${logoUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        opacity: isActive ? 1 : 0.2,
                        filter: isActive ? 'grayscale(0%) brightness(1.1)' : 'grayscale(100%) contrast(0.7)',
                    }}
                />
            )}

            {isActive && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/10 blur-sm pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                />
            )}

            {!logoUrl && (
                <span className={`relative text-xs font-bold transition-colors duration-500 ${isActive ? 'text-blue-400' : 'text-white/20'}`}>
                    {item.partner.name[0]}
                </span>
            )}
        </motion.div>
    );
};