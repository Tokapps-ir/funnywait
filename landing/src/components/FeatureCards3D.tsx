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

  const selected = cards.find((c) => c.id === selectedId);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Hidden audio element for click sound */}
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3" preload="auto" />

      {/* Section header */}
      <div className="text-center mb-8">
        <h2 className="text-5xl font-black mb-4">{config.section_title}</h2>
        <p className="text-white/40">{config.section_subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left Column — card list */}
        <div className="lg:col-span-4 space-y-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`glass-card cursor-pointer p-6 transition-all duration-300 transform ${
                selectedId === card.id
                  ? 'ring-2 ring-emerald-400 scale-105 shadow-2xl'
                  : 'hover:scale-102 hover:shadow-lg'
              }`}
            >
              <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                <span
                  className={`w-2 h-2 rounded-full mr-3 transition-colors ${
                    selectedId === card.id ? 'bg-emerald-400' : 'bg-gray-400'
                  }`}
                />
                {card.title}
              </h3>
              <p className="text-sm text-white/70">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Right Column — detail panel */}
        <div className="lg:col-span-8">
          {selected ? (
            <div className="glass-card p-8 h-full transition-all duration-500 ease-in-out">
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold text-white mb-4">{selected.content_title}</h2>
                <p className="text-white/80 mb-6 leading-relaxed">{selected.content_description}</p>

                {selected.media && (
                  <div className="mt-auto">
                    {selected.media.mime.startsWith('image/') ? (
                      <img
                        src={mediaUrl(selected.media.url)}
                        alt={selected.content_title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <video
                        src={mediaUrl(selected.media.url)}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="glass-card p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">انتخاب یک گزینه</h3>
                <p className="text-white/60">برای مشاهده جزئیات، یکی از گزینه‌های سمت چپ را انتخاب کنید</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { FeatureCards3DComponent as FeatureCards3D };
