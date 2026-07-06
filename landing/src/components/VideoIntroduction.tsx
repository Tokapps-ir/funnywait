import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Howl } from 'howler';
import { Video, videoUrl } from '../types';

interface VideoIntroductionProps {
  bgMusic: Howl;
  isVisible: boolean;
  onClose: () => void;
  video?: Video;
}

export const VideoIntroduction: React.FC<VideoIntroductionProps> = ({
                                                                      bgMusic,
                                                                      isVisible,
                                                                      onClose,
                                                                      video
                                                                    }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Background music coordinator
  useEffect(() => {
    if (isVisible) {
      if (bgMusic.playing()) bgMusic.pause();
    } else {
      if (!bgMusic.playing()) bgMusic.play();
    }
  }, [isVisible, bgMusic]);

  // Sync mute state and play state
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress || 0);
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  return (
      <AnimatePresence>
        {isVisible && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              {/* Smoothly curved video container */}
              <motion.div
                  initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    rotateY: 0,
                    boxShadow: '0 0 100px rgba(16, 185, 129, 0.3)'
                  }}
                  exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.23, 1, 0.32, 1],
                    scale: { duration: 0.5 }
                  }}
                  className="relative w-full max-w-4xl aspect-video mx-4 overflow-hidden rounded-2xl border border-white/10 bg-black group"
              >
                {/* Video player */}
                <video
                    ref={videoRef}
                    src={videoUrl(video)}
                    autoPlay
                    muted={isMuted}
                    loop={false}
                    playsInline
                    /* FIX 2: Added onClick handler and cursor pointer to toggle play/pause */
                    onClick={togglePlay}
                    className="w-full h-full object-cover cursor-pointer"
                    onEnded={onClose}
                    onPlaying={() => setVideoLoaded(true)}
                    onTimeUpdate={handleTimeUpdate}
                />

                {/* Loading overlay */}
                {!videoLoaded && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center z-30">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500" />
                    </div>
                )}

                {/* Custom Control Bar */}
                {videoLoaded && (
                    /* FIX 1: Removed 'opacity-0 group-hover:opacity-100' so controls stay visible */
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 pt-16 flex flex-col gap-3 z-20">

                      {/* Timeline Slider */}
                      <input
                          type="range"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={handleTimelineChange}
                          className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                      />

                      {/* Left & Right Button Controls */}
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                          <button onClick={togglePlay} className="hover:text-emerald-400 transition-colors">
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </button>

                          <button onClick={toggleMute} className="hover:text-emerald-400 transition-colors">
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center z-30 transition-all duration-200 hover:scale-110 shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Floating Cube in top-left corner */}
                <motion.div
                    initial={{ scale: 1, x: 0, y: 0 }}
                    animate={{ scale: 0.4, x: -140, y: -90 }}
                    transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute top-5 left-5 z-20 pointer-events-none"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-black text-xs font-bold">FV</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
  );
};