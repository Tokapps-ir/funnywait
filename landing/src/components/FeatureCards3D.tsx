import React, { useState, useRef } from 'react';
import { FeaturesConfig, FeatureCard } from '../types';

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://127.0.0.1:1337';

function mediaUrl(url: string): string {
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

interface FeatureCards3DProps {
  config: FeaturesConfig;
  cards: FeatureCard[];
}

const FeatureCards3DComponent = ({ config, cards }: FeatureCards3DProps) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleCardClick = (id: number) => {
    playClickSound();
    setSelectedId(id);
  };

  const closeModal = () => {
    setSelectedId(null);
  };

  const selected = cards.find((c) => c.id === selectedId);

  return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8" dir="rtl">
        {/* Hidden audio element for click sound */}
        <audio ref={audioRef} src="/Musics/Click.mp3" preload="auto" />

        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">{config.section_title}</h2>
          <p className="text-white/70 max-w-2xl mx-auto text-sm font-semibold md:text-base">{config.section_subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* Left Column — card list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-4 gap-4 auto-rows-max">
            {cards.map((card) => (
                <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`glass-card cursor-pointer p-5 transition-all duration-300 rounded-2xl border border-white/10 backdrop-blur-sm ${
                        selectedId === card.id
                            ? 'bg-white/15 ring-2 ring-emerald-400 scale-[1.02] shadow-2xl'
                            : 'bg-white/5 hover:bg-white/10 hover:scale-[1.01]'
                    }`}
                >
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-3">
                <span
                    className={`w-2.5 h-2.5 rounded-full font-semibold transition-colors shrink-0 ${
                        selectedId === card.id ? 'bg-emerald-400' : 'bg-white/40'
                    }`}
                />
                    {card.title}
                  </h3>
                  <p className="text-sm text-white/50 font-semibold line-clamp-2 leading-relaxed">{card.description}</p>
                </div>
            ))}
          </div>

          {/* Right Column — Desktop Detail Panel / Mobile Glass Modal */}
          <div
              className={`
            ${selected ? 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:static lg:flex lg:col-span-8' : 'hidden lg:flex lg:col-span-8'}
          `}
              onClick={closeModal}
          >
            {selected ? (
                <div
                    className="glass-card bg-white/10 border border-white/20 backdrop-blur-xl p-6 md:p-8 rounded-3xl w-full max-w-2xl lg:max-w-none h-auto lg:h-full flex flex-col shadow-2xl animate-fade-in"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      {/* Header with Close Button for Mobile */}
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">{selected.content_title}</h2>
                        <button
                            onClick={closeModal}
                            className="lg:hidden p-2 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
                            aria-label="Close modal"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      <p className="text-white/70 mb-6 leading-relaxed text-base font-semibold">{selected.content_description}</p>
                    </div>

                    {/* Media Container with CTA Opportunity */}
                    <div className="mt-4 flex flex-col gap-6">
                      {selected.media && (
                          <div className="overflow-hidden rounded-xl border border-white/10 shadow-lg">
                            {selected.media.mime.startsWith('image/') ? (
                                <img
                                    src={mediaUrl(selected.media.url)}
                                    alt={selected.content_title}
                                    className="w-full h-48 md:h-64 object-cover"
                                />
                            ) : (
                                <video
                                    src={mediaUrl(selected.media.url)}
                                    controls
                                    className="w-full h-48 md:h-64 object-cover"
                                />
                            )}
                          </div>
                      )}


                    </div>
                  </div>
                </div>
            ) : (
                /* Desktop Default State Placeholder */
                <div className="hidden lg:flex glass-card bg-white/5 border border-white/10 backdrop-blur-sm p-8 h-full w-full items-center justify-center rounded-3xl">
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                      <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">انتخاب یک ویژگی</h3>
                    <p className="text-white/50 text-sm">برای مشاهده جزییات و مزایای اختصاصی ما، یکی از گزینه‌های سمت راست را انتخاب کنید.</p>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export { FeatureCards3DComponent as FeatureCards3D };