import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalculatorInputs, CalculatorResults, CalculatorConfig } from '../types';
import { toPersianDigits, formatCurrency } from '../lib/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Howl } from 'howler';





interface Props {
  config: CalculatorConfig;
  resultSound:Howl,
  clickSound:Howl,
}

export const Calculator: React.FC<Props> = ({ config ,resultSound,clickSound}) => {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    visitors: config.default_visitors,
    waitTime: config.default_wait_time,
    participation: config.default_participation,
    engagement: config.default_engagement,
    attentionValue: config.default_attention_value,
    conversion: config.default_conversion,
    profit: config.default_profit,
    subscriptionCost: config.subscription_cost,
  });

  const results = useMemo<CalculatorResults>(() => {
    const totalWaitTime = inputs.visitors * inputs.waitTime;
    const realEngagementTime = totalWaitTime * (inputs.participation / 100);
    const attentionValueGenerated = realEngagementTime * inputs.attentionValue;
    const extraSalesCount = inputs.visitors * (inputs.conversion / 100);
    const dailyDirectIncome = extraSalesCount * inputs.profit;
    const dailyTotalBenefit = attentionValueGenerated + dailyDirectIncome;
    const monthlyTotalBenefit = dailyTotalBenefit * 30;
    const monthlyNetProfit = monthlyTotalBenefit - inputs.subscriptionCost;
    const roi = (monthlyNetProfit / inputs.subscriptionCost) * 100;

    return {
      totalWaitTime,
      realEngagementTime,
      attentionValueGenerated,
      extraSalesCount,
      dailyDirectIncome,
      dailyTotalBenefit,
      monthlyTotalBenefit,
      monthlyNetProfit,
      roi,
    };
  }, [inputs]);

  useEffect(() => {
    resultSound.play();
  }, [results.roi > 0]);

  const handleInputChange = (key: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
    clickSound.play();
  };

  const chartData = [
    { name: 'بدون فانی‌ویت', value: 0 },
    { name: 'با فانی‌ویت', value: results.monthlyTotalBenefit },
  ];

  const getMessage = () => {
    if (results.roi > 200) return config.high_profit_msg;
    if (results.roi > 50) return config.mid_profit_msg;
    return config.low_profit_msg;
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl md:text-7xl font-black cinematic-text mb-6">
          ماشین حساب هوشمند ارزش زمان انتظار
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          اثبات اقتصادی ارزش فانی‌ویت برای مدیران هوشمند کسب‌وکار
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Inputs */}
        <div className="glass-card p-8 space-y-8">
          <InputGroup
            label="تعداد مراجعین روزانه"
            value={inputs.visitors}
            min={1}
            max={500}
            unit="نفر"
            onChange={(v) => handleInputChange('visitors', v)}
          />
          <InputGroup
            label="میانگین زمان انتظار هر نفر"
            value={inputs.waitTime}
            min={1}
            max={120}
            unit="دقیقه"
            onChange={(v) => handleInputChange('waitTime', v)}
          />
          <InputGroup
            label="درصد مشارکت در بازی‌ها"
            value={inputs.participation}
            min={0}
            max={100}
            unit="درصد"
            onChange={(v) => handleInputChange('participation', v)}
          />
          <InputGroup
            label="ارزش هر دقیقه توجه"
            value={inputs.attentionValue}
            min={100}
            max={5000}
            unit="تومان"
            onChange={(v) => handleInputChange('attentionValue', v)}
          />
          <InputGroup
            label="نرخ تبدیل به خرید"
            value={inputs.conversion}
            min={0}
            max={50}
            unit="درصد"
            onChange={(v) => handleInputChange('conversion', v)}
          />
          <InputGroup
            label="سود هر فروش اضافه"
            value={inputs.profit}
            min={10000}
            max={1000000}
            unit="تومان"
            step={10000}
            onChange={(v) => handleInputChange('profit', v)}
          />
        </div>

        {/* Results */}
        <div className="space-y-8">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <ResultItem label="منفعت ماهانه" value={formatCurrency(results.monthlyTotalBenefit)} unit="تومان" />
              <ResultItem label="سود خالص ماهانه" value={formatCurrency(results.monthlyNetProfit)} unit="تومان" />
            </div>

            <div className="text-center p-8 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-8">
              <p className="text-sm text-emerald-400 mb-2 uppercase tracking-widest">بازگشت سرمایه (ROI)</p>
              <motion.div
                key={results.roi}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-6xl md:text-8xl font-black text-emerald-400"
              >
                {toPersianDigits(Math.round(results.roi))}%
              </motion.div>
            </div>

            <div className="text-center font-bold text-xl text-white/80">
              {getMessage()}
            </div>
          </div>

          <div className="glass-card p-8 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: '#ffffff05' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/90 border border-white/10 p-3 rounded-lg backdrop-blur-md">
                          <p className="text-white/60 text-xs mb-1">{payload[0].payload.name}</p>
                          <p className="text-emerald-400 font-bold">{formatCurrency(payload[0].value as number)} تومان</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#333' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

const InputGroup = ({ label, value, min, max, unit, step = 1, onChange }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <label className="text-white/70 font-medium">{label}</label>
      <span className="text-emerald-400 font-bold text-lg">
        {toPersianDigits(value)} <span className="text-xs font-normal text-white/40">{unit}</span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
    />
  </div>
);

const ResultItem = ({ label, value, unit }: any) => (
  <div className="space-y-1">
    <p className="text-xs text-white/40">{label}</p>
    <p className="text-xl font-bold text-white">
      {value} <span className="text-[10px] font-normal text-white/30">{unit}</span>
    </p>
  </div>
);
