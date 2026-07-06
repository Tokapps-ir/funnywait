import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Star, Package, Code, Server, Smartphone, X } from 'lucide-react';
import { getServices } from '../lib/serviceService';

interface Service {
  id: number;
  documentId: string;
  title: string;
  description: string;
  features: string;
  icon: string;
  locale: string;
}

const iconMap = {
  Code: Code,
  Wrench: Wrench,
  Server: Server,
  Smartphone: Smartphone,
  Package: Package,
  Star: Star,
};

export const OurServices: React.FC = () => {
  const [activeService, setActiveService] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await getServices();
        setServices(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('خطا در بارگذاری خدمات');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleServiceClick = (index: number) => {
    playClickSound();

    // On mobile/tablet, open modal instead of changing active tab
    if (window.innerWidth < 1024) {
      setActiveService(index);
      setIsModalOpen(true);
    } else {
      setActiveService(index);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Get icon component based on icon string
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="w-6 h-6" /> : <Code className="w-6 h-6" />;
  };

  // Parse features string (comma-separated) into array
  const parseFeatures = (featuresString: string): string[] => {
    return featuresString.split(',').map(feature => feature.trim()).filter(feature => feature.length > 0);
  };

  // Service content component (reused in both desktop and modal)
  const ServiceContent = ({ service }: { service: Service }) => (
      <div className="h-full flex flex-col">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
            {getIconComponent(service.icon)}
          </div>
          <h3 className="text-2xl font-bold text-white flex-1 text-right">
            {service.title}
          </h3>
        </div>

        <p className="text-white/60 font-semibold text-lg leading-relaxed mb-8 flex-1 text-right">
          {service.description}
        </p>

        <div className="pt-6 border-t border-white/10">
          <h4 className="text-lg font-bold text-white mb-4 text-right">ویژگی‌های خدمات:</h4>
          <ul className="space-y-3">
            {parseFeatures(service.features || '').map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/50 font-semibold text-right">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                  <span>{feature}</span>
                </li>
            ))}
          </ul>
        </div>
      </div>
  );

  if (loading) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-emerald-400 animate-spin" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              خدمات ما
            </h2>
          </div>
          <p className="text-white/70 text-lg">در حال بارگذاری خدمات...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-red-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text text-transparent">
              خدمات ما
            </h2>
          </div>
          <p className="text-red-400 text-lg">{error}</p>
        </div>
    );
  }

  return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        {/* Hidden audio element for sound effects */}
        <audio ref={audioRef} src="/Musics/Scroll.mp3" preload="auto" />

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Package className="w-8 h-8 text-emerald-400" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              خدمات ما
            </h2>
          </div>
          <p className="text-white/40 font-semibold text-lg max-w-2xl mx-auto">
            خدمات تخصصی و جامع در زمینه فناوری اطلاعات و توسعه نرم‌افزار
          </p>
        </motion.div>

        {/* Desktop Layout - Tabular */}
        <div className="hidden lg:grid grid-cols-12 gap-8 min-h-[500px]">
          {/* Left Column - Service Cards */}
          <div className="col-span-4 space-y-4">
            {services.map((service, index) => (
                <motion.div
                    key={service.documentId}
                    onClick={() => handleServiceClick(index)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`glass-card cursor-pointer p-6 transition-all duration-300 transform ${
                        activeService === index
                            ? 'ring-2 ring-emerald-400 scale-105 shadow-2xl shadow-emerald-500/10'
                            : 'hover:shadow-lg hover:border-white/20'
                    }`}
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                      {getIconComponent(service.icon)}
                    </div>
                    <div className="text-right flex-1">
                      <h3 className="font-bold text-white text-lg">{service.title}</h3>
                      <p className="text-sm text-white/60 font-semibold text-xs mt-1">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                    ))}
                  </div>
                </motion.div>
            ))}
          </div>

          {/* Right Column - Selected Service Content */}
          <div className="col-span-8">
            <motion.div
                key={activeService}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-card p-8 h-full transition-all duration-500 ease-in-out transform"
            >
              <ServiceContent service={services[activeService]} />
            </motion.div>
          </div>
        </div>

        {/* Mobile/Tablet Layout - Grid */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service, index) => (
              <motion.div
                  key={service.documentId}
                  onClick={() => handleServiceClick(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-card cursor-pointer p-6 transition-all duration-300 hover:shadow-lg hover:border-white/20"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    {getIconComponent(service.icon)}
                  </div>
                  <div className="text-right flex-1">
                    <h3 className="font-bold text-white text-lg">{service.title}</h3>
                    <p className="text-sm text-white/60 font-semibold text-xs mt-1 line-clamp-2">{service.description}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                      <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                  ))}
                </div>
              </motion.div>
          ))}
        </div>

        {/* Modal for Mobile/Tablet */}
        <AnimatePresence>
          {isModalOpen && services[activeService] && (
              <>
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed inset-x-4 top-[10%] bottom-[10%] lg:hidden z-50"
                >
                  <div className="glass-card h-full overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
                        aria-label="بستن"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="p-6 pt-16">
                      <ServiceContent service={services[activeService]} />
                    </div>
                  </div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </div>
  );
};