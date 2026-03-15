import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Handshake, MapPin, Calendar, Award } from 'lucide-react';
import { getBusinessPartners } from '../lib/businessPartnerService';
import { BusinessPartner } from '../types';

export const OurBusinessPartners: React.FC = () => {
  const [partners, setPartners] = useState<BusinessPartner[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Function to parse achievements string into array
  const parseAchievements = (achievements: string | null): string[] => {
    if (!achievements) return [];
    return achievements.split('\n').filter(item => item.trim() !== '');
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <Handshake className="w-8 h-8 text-blue-400 animate-spin" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            همکاران تجاری ما
          </h2>
        </div>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          لیستی از همکاران تجاری ارزشمند در سراسر کشور
        </p>
      </motion.div>

      {/* Horizontal Timeline Layout */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500/30 to-transparent"></div>
        
        <div className="space-y-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.documentId}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
            >
              <div className={`${index % 2 === 0 ? 'pr-8' : 'pl-8'} w-1/2`}>
                <div className="glass-card p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-blue-400 text-2xl font-bold border-2 border-blue-400/30 overflow-hidden">
                      {partner.logo?.url ? (
                        <img
                          src={partner.logo.url.startsWith('http') ? partner.logo.url : `${import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'}${partner.logo.url}`}
                          alt={partner.name}
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
                        <span className="flex items-center justify-center w-full h-full">
                          {partner.name[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-1">
                      <h3 className="font-bold text-white text-xl">{partner.name}</h3>
                      <p className="text-blue-400 font-medium">{partner.company}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-right mb-4">{partner.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-white/60 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{partner.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>از {partner.since}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium text-white">دستاوردها:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parseAchievements(partner.achievements).map((achievement, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30"
                        >
                          {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="relative z-10 w-8 h-8 bg-blue-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              <div className="w-1/2"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
