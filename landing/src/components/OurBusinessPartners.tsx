import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {X, ChevronLeft, ChevronRight, Handshake, MapPin, Award, Calendar} from 'lucide-react';
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
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Grid configuration
  const ROWS = 4;
  const VISIBLE_COLS = 20;
  const TOTAL_COLS = 40; // Double for seamless loop

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

  // Create logo items with random glow delays
  const createLogoItems = useCallback((): LogoItem[] => {
    if (partners.length === 0) return [];

    const items: LogoItem[] = [];
    const totalCells = ROWS * TOTAL_COLS;

    for (let i = 0; i < totalCells; i++) {
      const partnerIndex = i % partners.length;
      items.push({
        partner: partners[partnerIndex],
        id: `logo-${i}`,
        randomGlowDelay: Math.random() * 10,
      });
    }

    return items;
  }, [partners]);

  const logoItems = createLogoItems();

  // FIX 1: Shuffle once and memoize — prevents grid reset on every render
  const shuffledLogoItems = useMemo(() => {
    const shuffled = [...logoItems];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [logoItems]);

  // Infinite scroll animation
  useEffect(() => {
    if (isHovering || !scrollRef.current) return;

    const animate = () => {
      setScrollPosition(prev => {
        const newPosition = prev + 0.5;
        return newPosition > 50 ? 0 : newPosition; // Reset at 50% for seamless loop
      });
    };

    const interval = setInterval(animate, 16); // ~60fps
    return () => clearInterval(interval);
  }, [isHovering]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedPartner) return;

      if (e.key === 'Escape') {
        setSelectedPartner(null);
      } else if (e.key === 'ArrowRight') {
        navigatePartner(1);
      } else if (e.key === 'ArrowLeft') {
        navigatePartner(-1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedPartner, partners]);

  const navigatePartner = (direction: number) => {
    if (!selectedPartner || partners.length === 0) return;

    const currentIndex = partners.findIndex(p => p.documentId === selectedPartner.documentId);
    const newIndex = (currentIndex + direction + partners.length) % partners.length;
    setSelectedPartner(partners[newIndex]);
  };

  const getLogoUrl = (partner: BusinessPartner) => {
    if (!partner.logo?.url) return null;
    return partner.logo.url.startsWith('http')
        ? partner.logo.url
        : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${partner.logo.url}`;
  };

  if (loading) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Handshake className="w-8 h-8 text-blue-400 animate-spin" />
            {/* FIX 2: Added responsive text sizing and break-words for header visibility */}
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
            <Handshake className="w-8 h-8 text-blue-400" />
            {/* FIX 2: Added responsive text sizing and break-words for header visibility */}
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent break-words">
              همکاران تجاری ما
            </h2>
          </div>
          <p className="text-white/60 text-lg max-w-2xl font-semibold mx-auto">
            لیستی از همکاران تجاری ارزشمند در سراسر کشور
          </p>
        </motion.div>

        {/* Infinite Scrolling Mosaic Grid */}
        <div
            className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-sm border border-white/10"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
          <div
              ref={scrollRef}
              className="flex"

          >
            {/* Duplicate the grid for seamless looping */}
            {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex-shrink-0">
                  <div className="grid" style={{
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    gridTemplateColumns: `repeat(${TOTAL_COLS}, minmax(80px, 1fr))`
                  }}>
                    {/* FIX 1: Use memoized shuffled array instead of shuffling on every render */}
                    {shuffledLogoItems.map((item, index) => (
                        <LogoCell
                            key={`${setIndex}-${item.id}`}
                            item={item}
                            isHovering={isHovering}
                            onSelect={() => setSelectedPartner(item.partner)}
                        />
                    ))}
                  </div>
                </div>
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
                    className="relative glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                      onClick={() => setSelectedPartner(null)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Navigation Buttons */}
                  <button
                      onClick={() => navigatePartner(-1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>

                  <button
                      onClick={() => navigatePartner(1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>

                  {/* Partner Details */}
                  <div className="p-8">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border-2 border-blue-400/30 overflow-hidden">
                        {getLogoUrl(selectedPartner) ? (
                            <img
                                src={getLogoUrl(selectedPartner)!}
                                alt={selectedPartner.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.parentNode) {
                                    const fallbackSpan = target.parentNode.querySelector('span');
                                    if (fallbackSpan) {
                                      fallbackSpan.style.display = 'flex';
                                    }
                                  }
                                }}
                            />
                        ) : (
                            <span className="flex items-center justify-center w-full h-full text-3xl font-bold text-blue-400">
                        {selectedPartner.name[0]}
                      </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white text-2xl mb-1">{selectedPartner.name}</h3>
                        <p className="text-blue-400 font-semibold">{selectedPartner.company}</p>
                      </div>
                    </div>

                    <p className="text-white/70 mb-6 leading-relaxed">{selectedPartner.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedPartner.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>از {selectedPartner.since}</span>
                      </div>
                    </div>

                    {selectedPartner.achievements && (
                        <div className="pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-semibold">دستاوردها:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {selectedPartner.achievements.split('\n').filter(a => a.trim()).map((achievement, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full border border-blue-400/30"
                                >
                          {achievement}
                        </span>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

// Logo Cell Component
interface LogoCellProps {
  item: LogoItem;
  isHovering: boolean;
  onSelect: () => void;
}

const LogoCell: React.FC<LogoCellProps> = ({ item, isHovering, onSelect }) => {
  const [isRandomlyGlowing, setIsRandomlyGlowing] = useState(false);

  // Random glow effect when not hovering
  useEffect(() => {
    if (isHovering) {
      setIsRandomlyGlowing(false);
      return;
    }

    const startGlow = () => {
      setIsRandomlyGlowing(true);
      setTimeout(() => setIsRandomlyGlowing(false), 2000);
    };

    const initialDelay = item.randomGlowDelay * 1000;
    const timeout = setTimeout(startGlow, initialDelay);

    const interval = setInterval(startGlow, 8000 + Math.random() * 4000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isHovering, item.randomGlowDelay]);

  const logoUrl = item.partner.logo?.url
      ? item.partner.logo.url.startsWith('http')
          ? item.partner.logo.url
          : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${item.partner.logo.url}`
      : null;

  return (
      <motion.div
          className={`
        relative aspect-square flex items-center justify-center cursor-pointer
        transition-all duration-300 overflow-hidden
        ${isRandomlyGlowing || isHovering ? '' : 'opacity-20 grayscale'}
      `}
          whileHover={{
            opacity: 1,
            scale: 1.1,
            zIndex: 10,
          }}
          onClick={onSelect}
          style={
            {
              backgroundImage: `url(${logoUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }
          }
      >
        {/* Glow Effect */}
        {(isRandomlyGlowing || isHovering) && (
            <motion.div
                className="absolute inset-0 bg-blue-500/30 blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
            />
        )}

        {/* Logo */}
        <div className="relative w-full h-[40px] ">
          <span className="flex items-center justify-center w-full h-full text-lg font-bold text-blue-400">
            {item.partner.name[0]}
          </span>
        </div>
      </motion.div>
  );
};