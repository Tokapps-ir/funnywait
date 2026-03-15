import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculatorState, RecommendationResult, QualityLevel, Package } from '../types';
import { calculateRecommendation } from '../lib/calculatePackage';
import { toPersianDigits, formatCurrency } from '../lib/helpers';
import { Zap, Users, Clock, Shield, CheckCircle2, AlertTriangle, Info, ArrowLeft } from 'lucide-react';
import { Howl } from 'howler';

const clickSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'],
  volume: 0.1,
});

const successSound = new Howl({
  src: ['https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'],
  volume: 0.2,
});

export const SmartCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    budget: 5000000,
    seats: 20,
    waitTime: 120,
    quality: 'standard',
  });

  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleCalculate = async () => {
    const recommendation = await calculateRecommendation(state);
    setResult(recommendation);
    setShowResult(true);
    successSound.play();
    
    // Scroll to result
    setTimeout(() => {
      const el = document.getElementById('recommendation-result');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleInputChange = (key: keyof CalculatorState, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
    clickSound.play();
  };

  const qualityOptions: { id: QualityLevel; label: string }[] = [
    { id: 'economic', label: 'اقتصادی' },
    { id: 'standard', label: 'استاندارد' },
    { id: 'professional', label: 'حرفه‌ای' },
    { id: 'premium', label: 'پریمیوم' },
  ];

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden">

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-black cinematic-text mb-6">
            ماشین حساب هوشمند پیشنهاد پکیج
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            با وارد کردن پارامترهای کسب‌وکار خود، بهترین راهکار فانی‌ویت را دریافت کنید.
          </p>
        </motion.div>

        <div className="glass-card p-8 md:p-12 mb-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Budget Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/70">
                  <Zap className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">بودجه تقریبی</span>
                </div>
                <span className="text-emerald-400 font-black text-xl">
                  {formatCurrency(state.budget)} <span className="text-xs font-normal text-white/40">تومان</span>
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={100000000}
                step={1000000}
                value={state.budget}
                onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest">
                <span>۱ میلیون</span>
                <span>۱۰۰ میلیون</span>
              </div>
            </div>

            {/* Seats Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/70">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="font-bold">تعداد صندلی</span>
                </div>
                <span className="text-blue-400 font-black text-xl">
                  {toPersianDigits(state.seats)} <span className="text-xs font-normal text-white/40">عدد</span>
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={200}
                value={state.seats}
                onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest">
                <span>۱ صندلی</span>
                <span>۲۰۰ صندلی</span>
              </div>
            </div>

            {/* Wait Time Slider */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">زمان انتظار مورد انتظار</span>
                </div>
                <span className="text-yellow-400 font-black text-xl">
                  {toPersianDigits(state.waitTime)} <span className="text-xs font-normal text-white/40">ثانیه</span>
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={600}
                step={10}
                value={state.waitTime}
                onChange={(e) => handleInputChange('waitTime', parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/30 uppercase tracking-widest">
                <span>۱۰ ثانیه</span>
                <span>۱۰ دقیقه</span>
              </div>
            </div>

            {/* Quality Level */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-white/70">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="font-bold">سطح کیفیت تجربه</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleInputChange('quality', opt.id)}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                      state.quality === opt.id
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleCalculate}
              className="group relative px-12 py-5 bg-emerald-500 text-black font-black text-xl rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">دریافت پیشنهاد هوشمند</span>
            </button>
          </div>
        </div>

        {/* Result Section */}
        <AnimatePresence>
          {showResult && result && (
            <motion.div
              id="recommendation-result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="mt-24"
            >
              {result.error ? (
                <div className="glass-card p-8 border-red-500/50 bg-red-500/5 text-center">
                  <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-red-500 mb-2">خطا در محاسبه</h3>
                  <p className="text-white/70">{result.error}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Warnings/Suggestions */}
                  {(result.warning || result.suggestion) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {result.warning && (
                        <div className="glass-card p-6 border-yellow-500/50 bg-yellow-500/5 flex gap-4 items-start">
                          <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0" />
                          <p className="text-sm text-white/80 leading-relaxed">{result.warning}</p>
                        </div>
                      )}
                      {result.suggestion && (
                        <div className="glass-card p-6 border-blue-500/50 bg-blue-500/5 flex gap-4 items-start">
                          <Info className="w-6 h-6 text-blue-500 shrink-0" />
                          <p className="text-sm text-white/80 leading-relaxed">{result.suggestion}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommended Package Card */}
                  <div className="glass-card p-8 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[120px] rounded-full -mr-32 -mt-32" />
                    
                    <div className="relative z-10 grid lg:grid-cols-2 gap-16">
                      <div>
                        <div className="inline-block px-4 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-tighter mb-6">
                          پیشنهاد هوشمند سیستم
                        </div>
                        <h3 className="text-6xl md:text-8xl font-black cinematic-text mb-8">
                          {result.recommendedPackage?.name}
                        </h3>
                        <p className="text-xl text-white/60 leading-relaxed mb-12">
                          {result.recommendedPackage?.advantage}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-8 mb-12">
                          <div>
                            <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">زمان پاسخگویی</p>
                            <p className="text-2xl font-bold text-white">{result.recommendedPackage?.responseTime}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/40 mb-1 uppercase tracking-widest">محدوده قیمت</p>
                            <p className="text-2xl font-bold text-emerald-400">{result.recommendedPackage?.priceRange}</p>
                          </div>
                        </div>

                        <button className="w-full md:w-auto px-12 py-5 bg-white text-black font-black text-lg rounded-2xl transition-all hover:bg-emerald-500 flex items-center justify-center gap-3">
                          دریافت مشاوره تخصصی
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                        <h4 className="text-xl font-bold mb-8 flex items-center gap-2">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          امکانات موجود در این پکیج
                        </h4>
                        <ul className="space-y-6">
                          {result.recommendedPackage?.products.map((p, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="flex items-center gap-4 text-white/80"
                            >
                              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                              <span className="font-medium">{p}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
