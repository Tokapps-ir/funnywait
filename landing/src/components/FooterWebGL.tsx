import React, { useEffect, useRef, useState } from 'react';
import { PixelCanvas } from './PixelCanvas';
import { SliderDive } from './SliderDive';
import { getFooter } from '@/src/lib/footerService';
import { Footer } from '@/src/types';
import {Certificate} from "node:crypto";

declare global {
  interface Window {
    Grid2Background: any;
  }
}

export const FooterWebGL: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgInstance, setBgInstance] = useState<any>(null);
  const [footerData, setFooterData] = useState<Footer | null>(null);

  useEffect(() => {
    const initWebGLBackground = async () => {
      try {
        // Dynamically import the Grid2Background
        // @ts-ignore
        const grid2Module = await import('./../../public/js/grid2.cdn.min');
        const bg = grid2Module.default(canvasRef.current);
        setBgInstance(bg);

        // Set up click handler for random colors
        const handleClick = () => {
          if (bg.grid) {
            bg.grid.setColors([0xffffff * Math.random(), 0xffffff * Math.random(), 0xffffff * Math.random()]);
            bg.grid.light1.color.set(0xffffff * Math.random());
            bg.grid.light1.intensity = 500 + Math.random() * 1000;
            bg.grid.light2.color.set(0xffffff * Math.random());
            bg.grid.light2.intensity = 250 + Math.random() * 250;
          }
        };

        document.body.addEventListener('click', handleClick);

        return () => {
          document.body.removeEventListener('click', handleClick);
          // Clean up WebGL context if possible
          if (bg && bg.destroy) {
            bg.destroy();
          }
        };
      } catch (error) {
        console.error('Failed to initialize WebGL background:', error);
      }
    };
    setTimeout(fn=>initWebGLBackground(),1000)
  }, []);

  useEffect(() => {
    const loadFooter = async () => {
      const response = await getFooter('fa');
      setFooterData(response.data);
    };
    loadFooter();
  }, []);

  if (!footerData) {
    return null;
  }

  // @ts-ignore
  // @ts-ignore
  return (
    <footer className="relative py-24 px-6 border-t border-white/5 bg-black/20 backdrop-blur-lg overflow-hidden">
      {/* WebGL Background Canvas */}
      <canvas
        ref={canvasRef}
        id="webgl-canvas"
        className="absolute inset-0 w-full h-full -z-20"
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}
      />

      {/* Dark Glass Overlay Layer */}
      <div
        className="absolute inset-0 w-full h-full -z-10 bg-black/40 backdrop-blur-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.4) 50%, rgba(0,0,0,0.9) 100%)',
          WebkitBackdropFilter: 'blur(5px)',
          backdropFilter: 'blur(5px)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="text-3xl font-black mb-6 text-white">{footerData.brand_name}</div>
            <p className="text-white/40 max-w-md leading-loose">
              {footerData.brand_description}
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">لینک‌های سریع</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              {false && footerData.quick_links.map((link, index) => (
                <li key={index}>
                  <div className="relative group">
                    <PixelCanvas
                      colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                      gap={10}
                      speed={25}
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                    />
                    <a
                      href={link.url}
                      className="relative z-10 hover:text-emerald-400 transition-colors block py-2 px-3 rounded-lg hover:bg-white/5"
                    >
                      {link.text}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-white">ارتباط با ما</h4>
            <div className="space-y-4 text-white/40 text-sm">
              <div className="relative group">
                <PixelCanvas
                  colors={["#fef08a", "#fde047", "#eab308"]}
                  gap={3}
                  speed={20}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                />
                <div className="relative z-10 block py-2 px-3 rounded-lg hover:bg-white/5">
                  {footerData.contact_address}
                </div>
              </div>
              <div className="relative group">
                <PixelCanvas
                  colors={["#fef08a", "#fde047", "#eab308"]}
                  gap={3}
                  speed={20}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                />
                <div className="relative z-10 block py-2 px-3 rounded-lg hover:bg-white/5">
                  تلفن: {footerData.contact_phone}
                </div>
              </div>
              <div className="relative group">
                <PixelCanvas
                  colors={["#fef08a", "#fde047", "#eab308"]}
                  gap={3}
                  speed={20}
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                />
                <div className="relative z-10 block py-2 px-3 rounded-lg hover:bg-white/5">
                  ایمیل: {footerData.contact_email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Slider Section */}
        <div className="mb-8">
          <SliderDive certificates={footerData?.certificates} />
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-widest">
          <div>{footerData.copyright_text}</div>
          <div className="flex gap-8">
            <div className="relative group">
              <PixelCanvas
                colors={["#fecdd3", "#fda4af", "#e11d48"]}
                gap={6}
                speed={80}
                noFocus={true}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              />
              <a
                href={footerData.terms_link}
                className="relative z-10 hover:text-white/40 transition-colors block py-1 px-2 rounded-lg"
              >
                قوانین و مقررات
              </a>
            </div>
            <div className="relative group">
              <PixelCanvas
                colors={["#fecdd3", "#fda4af", "#e11d48"]}
                gap={6}
                speed={80}
                noFocus={true}
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
              />
              <a
                href={footerData.privacy_link}
                className="relative z-10 hover:text-white/40 transition-colors block py-1 px-2 rounded-lg"
              >
                حریم خصوصی
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};