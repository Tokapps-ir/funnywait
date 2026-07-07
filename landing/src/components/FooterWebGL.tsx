import React, { useEffect, useRef, useState } from 'react';
import { PixelCanvas } from './PixelCanvas';
import { SliderDive } from './SliderDive';
import { getFooter } from '@/src/lib/footerService';
import { Footer, FooterLink } from '@/src/types';

declare global {
  interface Window {
    Grid2Background: any;
  }
}

export const FooterWebGL: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [footerData, setFooterData] = useState<Footer | null>(null);

  // 1. Handle WebGL Initialization & Proper Cleanup
  useEffect(() => {
    let bgInstance: any = null;
    let handleClick: (() => void) | null = null;

    const initWebGLBackground = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamically import the Grid2Background
        // @ts-ignore
        const grid2Module = await import('./../../public/js/grid2.cdn.min');
        bgInstance = grid2Module.default(canvasRef.current);

        handleClick = () => {
          // Use optional chaining (?.) to prevent crashing if light1 isn't ready
          if (bgInstance?.grid) {
            bgInstance.grid.setColors([
              0xffffff * Math.random(),
              0xffffff * Math.random(),
              0xffffff * Math.random(),
            ]);

            if (bgInstance.grid.light1?.color) {
              bgInstance.grid.light1.color.set(0xffffff * Math.random());
              bgInstance.grid.light1.intensity = 500 + Math.random() * 1000;
            }

            if (bgInstance.grid.light2?.color) {
              bgInstance.grid.light2.color.set(0xffffff * Math.random());
              bgInstance.grid.light2.intensity = 250 + Math.random() * 250;
            }
          }
        };

        document.body.addEventListener('click', handleClick);
      } catch (error) {
        console.error('Failed to initialize WebGL background:', error);
      }
    };

    initWebGLBackground();

    // Correctly returning the cleanup function to React
    return () => {
      if (handleClick) {
        document.body.removeEventListener('click', handleClick);
      }
      if (bgInstance && typeof bgInstance.destroy === 'function') {
        bgInstance.destroy();
      }
    };
  }, []); // Runs once on mount, canvas is guaranteed to be there now

  // 2. Fetch Footer Data
  useEffect(() => {
    const loadFooter = async () => {
      try {
        const response = await getFooter('fa');
        setFooterData(response.data);
      } catch (err) {
        console.error("Failed to load footer data", err);
      }
    };
    loadFooter();
  }, []);

  return (
      <footer className="relative py-24 px-6 border-t border-white/5 bg-black/20 backdrop-blur-lg overflow-hidden min-h-[400px]">
        {/* WebGL Background Canvas - Always rendered so ref is never null */}
        <canvas
            ref={canvasRef}
            id="webgl-canvas"
            className="absolute inset-0 w-full h-full -z-20 pointer-events-none"
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}
        />

        {/* Dark Glass Overlay Layer */}
        <div
            className="absolute inset-0 w-full h-full -z-10 bg-black/40 backdrop-blur-xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.4) 50%, rgba(0,0,0,0.9) 100%)',
              WebkitBackdropFilter: 'blur(5px)',
              backdropFilter: 'blur(5px)',
            }}
        />

        {/* Only hide the text content while loading, keeping the canvas intact */}
        {!footerData ? (
            <div className="flex justify-center items-center text-white h-full">در حال بارگذاری...</div>
        ) : (
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid md:grid-cols-4 gap-12">
                <div className="col-span-2">
                  <div className="text-3xl font-black mb-6 text-white ">{footerData.brand_name}</div>
                  <p className="text-white/50 font-bold max-w-md leading-loose">
                    {footerData.brand_description}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold mb-6 text-white">لینک‌های سریع</h4>
                  <ul className="space-y-4 text-white/70 text-sm font-bold">
                    {footerData.quick_links.map((link, index) => (
                        <li key={index}>
                          <div className="relative group">
                            <PixelCanvas
                                colors={["#e0f2fe", "#7dd3fc", "#0ea5e9"]}
                                gap={10}
                                speed={45}
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                            />
                            <a
                                href={link.url}
                                className="relative z-10 hover:text-emerald-400 transition-colors block py-2 px-3 rounded-lg bg-white/20"
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
                  <div className="space-y-4 text-white/80 text-md">
                    <div className="relative group">
                      <PixelCanvas
                          colors={["#383415", "#54480e", "#85680e"]}
                          gap={10}
                          speed={10}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                      />
                      <div className="relative z-10 block py-2 px-3 rounded-lg hover:bg-white/5">
                        {footerData.contact_address}
                      </div>
                    </div>
                    <div className="relative group">
                      <PixelCanvas
                          colors={["#383415", "#54480e", "#85680e"]}
                          gap={10}
                          speed={10}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                      />
                      <a href={"tell://" + footerData.contact_phone} className="relative z-10 block py-2 px-3 rounded-lg hover:bg-white/5">
                        {footerData.contact_phone}
                      </a>
                    </div>
                    <div className="relative group">
                      <PixelCanvas
                          colors={["#383415", "#54480e", "#85680e"]}
                          gap={10}
                          speed={10}
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                      />
                      <div className="relative z-10 block py-2 px-3 rounded-lg hover:bg-white/5">
                        {footerData.contact_email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <SliderDive certificates={footerData?.certificates} />
              </div>

              <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[15px] text-white font-bold uppercase tracking-widest">
                <div>{footerData.copyright_text}</div>
                <div className="flex gap-8">
                  {footerData?.copyright_links?.map((link: FooterLink, index) => (
                      <div className="relative group" key={index + "_footerlink"}>
                        <PixelCanvas
                            colors={["#fecdd3", "#fda4af", "#e11d48"]}
                            gap={6}
                            speed={80}
                            noFocus={true}
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
                        />
                        <a
                            href={link.url}
                            className="relative z-10 hover:text-white/90 transition-colors block py-1 px-2 rounded-lg"
                        >
                          {link.text}
                        </a>
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}
      </footer>
  );
};