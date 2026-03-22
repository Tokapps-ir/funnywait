import React, { useState, useEffect, useRef, useCallback } from 'react';
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
// Badge Detection Constants & Interfaces
// ============================================================================

const BADGE_DEBOUNCE_MS = 100; // Prevent flickering on rapid hover
const BADGE_AUTO_HIDE_MS = 2000; // Auto-hide after inactivity
const BADGE_OFFSET_X = 24; // Horizontal offset from cursor
const BADGE_OFFSET_Y = -36; // Vertical offset (above cursor)

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
 * Custom Hook for Badge Detection System
 * Listens to mouse events on interactive elements, reads 'badge' attribute,
 * and manages state with debouncing and auto-hide logic.
 */
function useBadgeDetection() {
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState('');
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // Refs for managing timeouts and debounce logic
  const hoverTimeoutRef = useRef<number | null>(null);
  const autoHideTimeoutRef = useRef<number | null>(null);

  // Debounce function to prevent flickering on rapid entry/exit
  const scheduleBadgeShow = useCallback((element: HTMLElement, mouseX: number, mouseY: number) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

    hoverTimeoutRef.current = window.setTimeout(() => {
      const badgeText = element.getAttribute('data-tooltip');


      if (badgeText && typeof badgeText === 'string') {
        setText(badgeText);
        setX(mouseX + BADGE_OFFSET_X);
        setY(mouseY + BADGE_OFFSET_Y);

        // Ensure RTL layout for Farsi text by checking direction context later in render
        setVisible(true);

        // Reset auto-hide timer
        if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
        autoHideTimeoutRef.current = window.setTimeout(() => {
          setVisible(false);
        }, BADGE_AUTO_HIDE_MS);
      } else {
        setVisible(false);
      }
    }, BADGE_DEBOUNCE_MS);
  }, []);

  // Cleanup function to run on unmount or when mouse leaves
  const clearBadges = useCallback(() => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (autoHideTimeoutRef.current) clearTimeout(autoHideTimeoutRef.current);
    setVisible(false);
  }, []);

  // Attach event listeners to interactive elements dynamically
  useEffect(() => {
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && ['DIV','SPAN','A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
        scheduleBadgeShow(target, e.clientX, e.clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Update position continuously while visible to keep it near cursor
      if (visible && hoverTimeoutRef.current === null) {
         setX(e.clientX + BADGE_OFFSET_X);
         setY(e.clientY + BADGE_OFFSET_Y);
      }
    };

    const handleMouseLeave = () => {
      clearBadges();
    };

    window.addEventListener('mousemove', handleMouseEnter, true); // Use capture to catch early
    window.addEventListener('mousemove', handleMouseMove, false);
    window.addEventListener('mouseleave', handleMouseLeave, false);

    // return () => {
    //   window.removeEventListener('mouseenter', handleMouseEnter as EventListener, true);
    //   window.removeEventListener('mousemove', handleMouseMove, false);
    //   window.removeEventListener('mouseleave', handleMouseLeave as EventListener, false);
    //   clearBadges();
    // };
  }, [scheduleBadgeShow, visible, clearBadges]);

  return { visible, text, x, y };
}

// ============================================================================
// Badge Component with Boundary Detection & RTL Support
// ============================================================================

const BadgeTooltip: React.FC<{
  visible: boolean;
  text: string;
  x: number;
  y: number;
  dir: 'ltr' | 'rtl';
}> = ({ visible, text, x, y, dir }) => {
  // Calculate safe position to prevent overflow
  const [safeX, setSafeX] = useState(x);
  const [safeY, setSafeY] = useState(y);

  useEffect(() => {
    if (!visible) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Approximate badge width (max content + padding)
    const badgeWidth = Math.min(text.length * 8, 160);
    const badgeHeight = 32; // Fixed height for consistency

    let newX = x;
    let newY = y;

    // RTL Logic: In RTL mode, we might want to position the badge to the left of the cursor
    if (dir === 'rtl') {
      newX -= BADGE_OFFSET_X * 2;
    }

    // Boundary Checks
    if (newX + badgeWidth > viewportWidth) {
      newX = viewportWidth - badgeWidth - 10; // Keep 10px margin from right edge
    }

    if (newY + badgeHeight > viewportHeight) {
      newY = viewportHeight - badgeHeight - 10; // Keep 10px margin from bottom edge
    }

    if (newX < 10) {
      newX = 10; // Keep 10px margin from left edge
    }

    setSafeX(newX);
    setSafeY(newY);
  }, [visible, x, y, text, dir]);

  return (
    <motion.div
      className={`fixed pointer-events-none z-[200] px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border 
        ${dir === 'rtl' ? 'text-right' : 'text-left'}
        bg-emerald-900/80 text-emerald-100 border-emerald-500/40`}
      style={{
        x: safeX,
        y: safeY,
        transformOrigin: dir === 'rtl' ? 'right center' : 'left center',
      }}
      initial={{ opacity: 0, scale: 0.9, y: safeY - 10 }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.9,
        y: visible ? safeY : safeY - 10
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <span className="text-xs font-medium tracking-wide">{text}</span>
    </motion.div>
  );
};

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
  
  // Badge Detection Hook Integration
  const { visible, text, badgeX, badgeY } = useBadgeDetection();

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

      {/* Badge Tooltip Component */}
      <BadgeTooltip
        visible={visible}
        text={text}
        x={badgeX}
        y={badgeY}
        dir={dir}
      />

      {/* Debug info */}
      <div className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]" style={{ display: dir === 'rtl' ? 'block' : 'none' }}>RTL Mode</div>
      <div className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]" style={{ display: dir === 'ltr' ? 'block' : 'none' }}>LTR Mode</div>
    </>
  );
};

export default CustomCursor;