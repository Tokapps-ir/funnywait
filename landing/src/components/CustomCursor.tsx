import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate, useSpring, type SpringConfig } from 'framer-motion';
import { Howl } from 'howler';
import { LanguageContext, Locale as ILocale, translations, useI18n } from '../lib/i18n';

// ============================================================================
// Cursor Animation System - Motion Configuration Constants
// ============================================================================

const OUTER_CIRCLE_RADIUS = 32;
const INNER_CIRCLE_RADIUS = 16;
const DOT_SIZE = 8;

const SPRING_CONFIG: Required<SpringConfig> = { damping: 25, stiffness: 180, mass: 0.5 };
const OUTER_CIRCLE_SPRING: Required<SpringConfig> = { ...SPRING_CONFIG, damping: 30, stiffness: 150 };
const INNER_CIRCLE_SPRING: Required<SpringConfig> = { ...SPRING_CONFIG, damping: 22, stiffness: 200 };
const DOT_SPRING: Required<SpringConfig> = { ...SPRING_CONFIG, damping: 15, stiffness: 250 };

// ============================================================================
// Badge Detection Constants & Interfaces
// ============================================================================

const BADGE_DEBOUNCE_MS = 150;
const BADGE_AUTO_HIDE_MS = 2500;
const BADGE_OFFSET_X = 48;
const BADGE_OFFSET_Y = -60;

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

/**
 * Custom Hook for Badge Detection System - Fixed Version
 * Uses a robust event listener strategy to ensure tooltips appear reliably.
 */
function useBadgeDetection() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');

  // Refs for managing timeouts
  const hoverTimeoutRef = useRef<number | null>(null);
  const autoHideTimeoutRef = useRef<number | null>(null);

  // Function to handle mouse enter on an element
  const handleElementEnter = useCallback((element: HTMLElement, mouseX: number, mouseY: number) => {
    // Clear previous hover timeout if exists
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    // Read the attribute directly from the DOM element
    const rawText = element.getAttribute('data-tooltip');

    if (rawText && typeof rawText === 'string' && rawText.trim() !== '') {
      setText(rawText);

      // Show badge after a tiny debounce to prevent flickering on rapid movement
      hoverTimeoutRef.current = window.setTimeout(() => {
        setVisible(true);

        // Reset auto-hide timer
        if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = window.setTimeout(() => {
          setVisible(false);
        }, BADGE_AUTO_HIDE_MS);
      }, BADGE_DEBOUNCE_MS);
    } else {
      // If no tooltip attribute, hide immediately (optional: keep visible if already showing?)
      // For now, we hide to avoid showing empty text.
      setVisible(false);
    }
  }, []);

  const handleElementLeave = useCallback(() => {
    // Clear all timers and hide badge
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    // We attach listeners to the window but check the target element type
    const handleGlobalMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Only trigger on elements that are likely interactive or have a tooltip attribute
      if (target && ['DIV', 'SPAN', 'A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        handleElementEnter(target, e.clientX, e.clientY);
      }
    };

    const handleGlobalMouseLeave = () => {
      handleElementLeave();
    };

    // Use capture phase for enter to catch it early, false for leave
    window.addEventListener('mouseenter', handleGlobalMouseEnter as EventListener, true);
    window.addEventListener('mouseleave', handleGlobalMouseLeave as EventListener, false);

    return () => {
      window.removeEventListener('mouseenter', handleGlobalMouseEnter as EventListener, true);
      window.removeEventListener('mouseleave', handleGlobalMouseLeave as EventListener, false);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    };
  }, [handleElementEnter, handleElementLeave]);

  return { visible, text };
}

// ============================================================================
// Badge Component with Blob Styling & Smooth Animations
// ============================================================================

const BadgeTooltip: React.FC<{
  visible: boolean;
  text: string;
  mouseX: number;
  mouseY: number;
  dir: 'ltr' | 'rtl';
}> = ({ visible, text, mouseX, mouseY, dir }) => {

  // Calculate position relative to cursor
  const posX = mouseX + BADGE_OFFSET_X;
  const posY = mouseY + BADGE_OFFSET_Y;

  return (
    <motion.div
      className={`fixed pointer-events-none z-[200] px-4 py-2 rounded-full shadow-xl backdrop-blur-md border 
        ${dir === 'rtl' ? 'text-right font-sans' : 'text-left font-sans'}
        bg-emerald-900/95 text-emerald-100 border-emerald-500/60`}
      style={{
        x: posX,
        y: posY,
        transformOrigin: dir === 'rtl' ? 'right center' : 'left center',
      }}
      initial={{ opacity: 0, scale: 0.8, y: posY - 20 }}
      animate={{
        opacity: 1,//visible ? 1 : 0
        scale: visible ? 1 : 0.8,
        y: visible ? posY : posY - 20
      }}
      exit={{ opacity: 0, scale: 0.7, y: posY - 30 }}
      transition={{
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1] // Custom bezier for "blob" bounce effect
      }}
    >
      <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
        {text}
      </span>

      {/* Decorative blob shape (bottom corner) */}
      <motion.div
        className={`absolute -bottom-1 ${dir === 'rtl' ? '-left-2' : '-right-2'} w-4 h-4 rounded-full bg-emerald-900/95 border border-emerald-500/60`}
        style={{
          x: dir === 'rtl' ? 8 : -16,
          y: 0,
        }}
        animate={{
          scale: visible ? [1, 1.2, 1] : 0,
          rotate: visible ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 1 }}
      />
    </motion.div>
  );
};

// ============================================================================
// Cursor Circle Components with Spring Animations
// ============================================================================

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
        borderColor: 'rgba(16,185,129,0.15)',
        left: -OUTER_CIRCLE_RADIUS,
        top: OUTER_CIRCLE_RADIUS,
      }}
    />
  );
};

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
        backgroundColor: 'rgba(16,185,129,0.52)',
        left: -INNER_CIRCLE_RADIUS,
        top: INNER_CIRCLE_RADIUS-4,
      }}
    />
  );
};

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
        backgroundColor: 'rgba(16, 185, 129, 1)',
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
  
  // Badge Detection Hook Integration
  const { visible, text } = useBadgeDetection();

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
      {/* Hide default system cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
        .no-cursor-hover { --tw-ring-offset-width: 0 !important; }
        a:not(.not-custom-cursor), button, input, select, textarea, [role="button"], .cursor-pointer { outline: none; }
      `}</style>

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

      {/* Badge Tooltip Component - Now positioned relative to cursor */}
      <BadgeTooltip
        visible={visible}
        text={text}
        mouseX={pos.x}
        mouseY={pos.y}
        dir={dir}
      />

      {/* Debug info (Optional) */}
      <div className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]" style={{ display: dir === 'rtl' ? 'block' : 'none' }}>RTL Mode</div>
      <div className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]" style={{ display: dir === 'ltr' ? 'block' : 'none' }}>LTR Mode</div>
    </>
  );
};

export default CustomCursor;