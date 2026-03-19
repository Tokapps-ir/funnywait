import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Star, Package, Code, Server, Smartphone } from 'lucide-react';
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

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleServiceClick = (index: number) => {
    playClickSound();
    setActiveService(index);
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
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          خدمات تخصصی و جامع در زمینه فناوری اطلاعات و توسعه نرم‌افزار
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-[500px]">
        {/* Left Column - Service Cards */}
        <div className="lg:col-span-4 space-y-4">
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
                  <p className="text-sm text-white/60 mt-1">{service.description}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 fill-yellow-40 text-yellow-400`} 
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column - Selected Service Content */}
        <div className="lg:col-span-8">
          <motion.div
            key={activeService}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 h-full transition-all duration-500 ease-in-out transform"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                  {getIconComponent(services[activeService]?.icon)}
                </div>
                <h3 className="text-2xl font-bold text-white flex-1 text-right">
                  {services[activeService]?.title}
                </h3>
              </div>
              
              <p className="text-white/80 text-lg leading-relaxed mb-8 flex-1 text-right">
                {services[activeService]?.description}
              </p>
              
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-lg font-bold text-white mb-4 text-right">ویژگی‌های خدمات:</h4>
                <ul className="space-y-3">
                  {parseFeatures(services[activeService]?.features || '').map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-white/80 text-right">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
