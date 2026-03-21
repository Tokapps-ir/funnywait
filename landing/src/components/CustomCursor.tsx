import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate, useSpring, type SpringConfig } from 'framer-motion';
import { Howl } from 'howler';
import { LanguageContext, Locale as ILocale, translations, useI18n } from '../lib/i18n';

// ============================================================================
// Cursor Animation System - Motion Configuration Constants
// ============================================================================

/** Outer circle radius (64px diameter = 32px radius) */
const OUTER_CIRCLE_RADIUS = 32; // px

/** Inner circle radius (32px diameter = 16px radius) */
const INNER_CIRCLE_RADIUS = 16; // px

/** Central dot size (8x8px) */
const DOT_SIZE = 8; // px

/** Spring configuration for smooth parallax effect */
const SPRING_CONFIG: Required<SpringConfig> = { damping: 25, stiffness: 180, mass: 0.5 };

/** Outer circle spring - slowest follow with slight delay for parallax depth */
const OUTER_CIRCLE_SPRING: Required<SpringConfig> = { ...SPRING_CONFIG, damping: 30, stiffness: 150 };

/** Inner circle spring - medium speed for balanced feel */
const INNER_CIRCLE_SPRING: Required<SpringConfig> = { ...SPRING_CONFIG, damping: 22, stiffness: 200 };

/** Central dot spring - snappier response for direct tracking */
const DOT_SPRING: Required<SpringConfig> = { ...SPRING_CONFIG, damping: 15, stiffness: 250 };

// ============================================================================
// Interface Definitions
// ============================================================================

export interface BadgeData {
  type: string;
  text: string;
}

interface CustomCursorProps {
  locale?: ILocale | null;
}

interface CursorCircleProps {
  mouseX: number;
  mouseY: number;
}

// ============================================================================
// Audio Setup
// ============================================================================

const cursorClickSound = new Howl({
  src: ['/Musics/Click.mp3'],
  volume: 0.5,
  html5: true,
});

// ============================================================================
// Helper Hooks
// ============================================================================

function useElementHovered() {
  const [isHovered, setIsHovered] = useState(false);
  return { isHovered, setIsHovered };
}

// ============================================================================
// Cursor Circle Components with Spring Animations
// ============================================================================

/** Outer Circle - Follows cursor with spring physics and parallax effect */
const OuterCircle: React.FC<CursorCircleProps> = ({ mouseX, mouseY }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(-OUTER_CIRCLE_RADIUS * 2);

  const smoothX = useSpring(x, OUTER_CIRCLE_SPRING);
  const smoothY = useSpring(y, { ...OUTER_CIRCLE_SPRING, damping: 35 });

  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY - OUTER_CIRCLE_RADIUS * 2);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute rounded-full border-2 pointer-events-none z-[100]"
      style={{
        x: smoothX,
        y: smoothY,
        width: OUTER_CIRCLE_RADIUS * 2,
        height: OUTER_CIRCLE_RADIUS * 2,
        borderColor: 'rgba(16,185,129,0.15)', // emerald-500/30
        left: -OUTER_CIRCLE_RADIUS,
        top: OUTER_CIRCLE_RADIUS,
      }}
    />
  );
};

/** Inner Circle - Solid background with delayed spring animation */
const InnerCircle: React.FC<CursorCircleProps> = ({ mouseX, mouseY }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(-INNER_CIRCLE_RADIUS * 2);

  const smoothX = useSpring(x, INNER_CIRCLE_SPRING);
  const smoothY = useSpring(y, { ...INNER_CIRCLE_SPRING, damping: 25 });

  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY - INNER_CIRCLE_RADIUS * 2);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none z-[100]"
      style={{
        x: smoothX,
        y: smoothY,
        width: INNER_CIRCLE_RADIUS * 2,
        height: INNER_CIRCLE_RADIUS * 2,
        backgroundColor: 'rgba(16,185,129,0.52)', // emerald-500 solid
        left: -INNER_CIRCLE_RADIUS,
        top: INNER_CIRCLE_RADIUS-4,
      }}
    />
  );
};

/** Central Dot - Perfectly centered with snappiest spring response */
const CentralDot: React.FC<CursorCircleProps> = ({ mouseX, mouseY }) => {
  const x = useMotionValue(mouseX);
  const y = useMotionValue(mouseY);

  const smoothX = useSpring(x, DOT_SPRING);
  const smoothY = useSpring(y, DOT_SPRING);

  useEffect(() => {
    x.set(mouseX);
    y.set(mouseY);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none z-[100]"
      style={{
        x: smoothX,
        y: smoothY,
        width: DOT_SIZE,
        height: DOT_SIZE,
        backgroundColor: 'rgba(16, 185, 129, 1)', // emerald-500 solid
        left: -DOT_SIZE / 2,
        top: -DOT_SIZE,
      }}
    />
  );
};

// ============================================================================
// Main Custom Cursor Component
// ============================================================================

export const CustomCursor: React.FC<CustomCursorProps> = ({ locale }) => {
  const { dir } = useI18n();
  
  const currentLocale = locale || 'fa';
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  const { isHovered, setIsHovered } = useElementHovered();
  
  // GPU-accelerated motion values for smooth animation
  const mouseXVal = useMotionValue(0);
  const mouseYVal = useMotionValue(0);

  useEffect(() => {
    const playWelcomePrompt = () => {
      try {
        cursorClickSound.stop();
        cursorClickSound.play();
        setTimeout(() => { cursorClickSound.mute(false); }, 100);
      } catch (error) { console.log('Audio prompt failed:', error); }
    };

    const timer = setTimeout(playWelcomePrompt, 500);
    return () => clearTimeout(timer);
  }, [currentLocale]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      mouseXVal.set(e.clientX);
      mouseYVal.set(e.clientY);
    };

    const handleDown = () => {
      setClicking(true);
      try { cursorClickSound.stop(); cursorClickSound.play(); } 
      catch (error) { console.log('Audio play failed:', error); }
    };

    const handleUp = () => setClicking(false);

    window.addEventListener('mousemove', handleMove, false);
    window.addEventListener('mousedown', handleDown, false);
    window.addEventListener('mouseup', handleUp, false);
    
    return () => {
      window.removeEventListener('mousemove', handleMove as EventListener, false);
      window.removeEventListener('mousedown', handleDown as EventListener, false);
      window.removeEventListener('mouseup', handleUp as EventListener, false);
    };
  }, []);

  useEffect(() => {
    const unsubscribeX = mouseXVal.on('change', (latest) => { 
      animate(mouseXVal, latest * 0.15, { type: 'spring', damping: 25, stiffness: 180 });
    });
    return () => { unsubscribeX(); };
  }, []);

  useEffect(() => {
    if (isHovered) {
      animate(mouseXVal, -mouseXVal.get() * 1.3, { type: 'spring', damping: 25, stiffness: 180 });
    } else {
      animate(mouseXVal, mouseXVal.get(), { type: 'spring', damping: 25, stiffness: 180 });
    }
    return () => {};
  }, [isHovered]);

  useEffect(() => {
    if (clicking) {
      animate(mouseYVal, mouseYVal.get() * 0.7, { type: 'spring', damping: 25, stiffness: 180 });
    } else {
      animate(mouseYVal, mouseYVal.get(), { type: 'spring', damping: 25, stiffness: 180 });
    }
    return () => {};
  }, [clicking]);

  useEffect(() => {
    return () => { cursorClickSound.unload(); };
  }, []);

  return (
    <>
      {/* Nested circles with spring animations */}
      <OuterCircle mouseX={pos.x} mouseY={pos.y} />
      <InnerCircle mouseX={pos.x} mouseY={pos.y} />
      <CentralDot mouseX={pos.x} mouseY={pos.y} />

      {/* Click ripple effect */}
      {clicking && (
        <motion.div
          className="fixed w-4 h-4 border-2 border-emerald-300 rounded-full pointer-events-none z-[100]"
          style={{ x: pos.x - 8, y: pos.y - 8 }}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      )}

      {/* Hover state indicator */}
      {isHovered && (
        <motion.div
          className="absolute w-1 h-1 bg-emerald-300 rounded-full pointer-events-none"
          style={{ x: pos.x, y: pos.y }}
          initial={{ opacity: 0 }}
          animate={{ scale: [0.8, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }}
        />
      )}

      {/* Debug info */}
      <div className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]" style={{ display: dir === 'rtl' ? 'block' : 'none' }}>RTL Mode</div>
      <div className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]" style={{ display: dir === 'ltr' ? 'block' : 'none' }}>LTR Mode</div>

      <style>{`
        .no-cursor-hover { --tw-ring-offset-width: 0 !important; }
        a:not(.not-custom-cursor), button, input, select, textarea, [role="button"], .cursor-pointer { outline: none; }
      `}</style>
    </>
  );
};

export default CustomCursor;