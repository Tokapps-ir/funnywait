import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Howl } from 'howler';

interface VideoIntroductionProps {
  bgMusic: Howl;
  isVisible: boolean;
  onClose: () => void;
}

export const VideoIntroduction: React.FC<VideoIntroductionProps> = ({
  bgMusic,
  isVisible,
  onClose
}) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Pause background music
      if (bgMusic.playing()) {
        bgMusic.pause();
      }
    } else {
      // Resume background music when video closes
      if (!bgMusic.playing()) {
        bgMusic.play();
      }
    }
  }, [isVisible, bgMusic]);

  useEffect(() => {
    if (videoRef.current) {
      const handleLoad = () => setVideoLoaded(true);
      const handleCanPlay = () => setVideoLoaded(true);
      const video = videoRef.current;
      video.addEventListener('loadeddata', handleLoad);
      video.addEventListener('canplay', handleCanPlay);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoad);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Curved video container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              rotateY: 0,
              borderRadius: '12px',
              boxShadow: '0 0 100px rgba(16, 185, 129, 0.3)'
            }}
            exit={{ 
              scale: 0.8, 
              opacity: 0, 
              rotateY: 90 
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.23, 1, 0.32, 1],
              scale: { duration: 0.5 }
            }}
            className="relative w-full max-w-4xl aspect-video mx-4 overflow-hidden"
            style={{
              clipPath: 'polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)',
            }}
          >
            {/* Video player */}
            <video
              ref={videoRef}
              src="https://cdn.pixabay.com/download/video/2024/01/15/video_f5e6c6c69c.mp4?filename=abstract-background-loop-1920x1080-30fps-48481_medium.mp4"
              autoPlay
              muted={false}
              loop={false}
              playsInline
              className="w-full h-full object-cover"
              onEnded={onClose}
            />
            
            {/* Loading overlay */}
            {!videoLoaded && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-10 transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Floating Rubik's cube in top-left corner */}
            <motion.div
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={{ 
                scale: 0.3, 
                x: -180, 
                y: -120
              }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-5 left-5 z-20"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-black text-xs font-bold">FV</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
