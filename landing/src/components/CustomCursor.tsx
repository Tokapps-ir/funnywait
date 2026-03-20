import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Howl } from 'howler';
import { LanguageContext, Locale, translations, useI18n } from '../lib/i18n';

// Audio instance for click sound - created outside component to avoid recreation on re-renders
const cursorClickSound = new Howl({
  src: ['/Musics/Click.mp3'],
  volume: 0.5,
  html5: true,
});

export interface BadgeData {
  type: string;
  text: string;
}

interface CustomCursorProps {
  locale?: Locale;
}

/**
 * Hook to detect if an element is clickable (has badge attribute or interactive styles)
 */
function useElementHovered() {
  const [isHovered, setIsHovered] = useState(false);
  const [badgeData, setBadgeData] = useState<BadgeData | null>(null);

  return { isHovered, badgeData, setIsHovered, setBadgeData };
}

/**
 * Hook to get the closest clickable element with badge attribute from a target element
 */
function useBadgeFromElement(target: Element | null) {
  const [badgeText, setBadgeText] = useState<string>('');
  
  useEffect(() => {
    if (!target) return;

    // Look for badge attribute on the element or its parents
    let currentEl: HTMLElement | null = target as HTMLElement;
    while (currentEl && !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(currentEl.tagName)) {
      if (currentEl.hasAttribute('data-badge') || currentEl.classList.contains('cursor-pointer')) {
        const badgeAttr = currentEl.getAttribute('data-badge');
        const badgeTextVal = currentEl.getAttribute('data-badge-text') || currentEl.getAttribute('title');
        
        if (badgeAttr) {
          setBadgeText(badgeAttr);
          return;
        } else if (badgeTextVal && !currentEl.classList.contains('no-cursor-hover')) {
          setBadgeText(badgeTextVal);
          return;
        }
      }
      currentEl = currentEl.parentElement || null;
    }

    // Check for interactive classes/attributes on the target itself
    const isInteractive = 
      currentEl?.hasAttribute('data-badge') ||
      currentEl?.getAttribute('href') ||
      currentEl?.tagName === 'BUTTON' ||
      currentEl?.classList.contains('cursor-pointer') ||
      currentEl?.hasAttribute('onclick');

    if (isInteractive) {
      const badgeAttr = currentEl.getAttribute('data-badge');
      const badgeTextVal = currentEl.getAttribute('data-badge-text') || currentEl.getAttribute('title');
      
      if (badgeAttr) {
        setBadgeText(badgeAttr);
      } else if (badgeTextVal && !currentEl.classList.contains('no-cursor-hover')) {
        setBadgeText(badgeTextVal);
      }
    }
  }, [target]);

  return badgeText;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ locale }) => {
  // Use context's locale if provided, otherwise use prop or default to 'fa'
  const { dir, t } = useI18n();
  const currentLocale = locale || 'en';
  
  // Cursor position state
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);
  
  // Hover state for clickable elements
  const { isHovered, setIsHovered } = useElementHovered();
  
  // Badge text from parent element
  const badgeText = useRef<string>('');

  // Use motion values for smoother animations (spring-based)
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const scale = useMotionValue(1);
  const hoverScale = useMotionValue(1);
  
  // For the outer ring
  const outerRingX = useMotionValue(0);
  const outerRingY = useMotionValue(0);

  // Track badge text from parent element
  const trackBadgeText = useCallback((target: Element | null) => {
    if (!target) return;

    let currentEl: HTMLElement | null = target as HTMLElement;
    while (currentEl && !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(currentEl.tagName)) {
      const badgeAttr = currentEl.getAttribute('data-badge');
      if (badgeAttr) {
        badgeText.current = badgeAttr;
        return;
      }
      
      // Check for interactive elements with title or data attributes
      if ((currentEl.hasAttribute('href') || 
           currentEl.tagName === 'BUTTON' || 
           currentEl.classList.contains('cursor-pointer')) &&
          !currentEl.classList.contains('no-cursor-hover')) {
        const badgeTextVal = currentEl.getAttribute('data-badge-text') || currentEl.getAttribute('title');
        if (badgeTextVal) {
          badgeText.current = badgeTextVal;
          return;
        }
      }
      
      currentEl = currentEl.parentElement || null;
    }
  }, []);

  // Audio prompt on initial load based on system language
  useEffect(() => {
    const playWelcomePrompt = () => {
      try {
        if (currentLocale === 'fa') {
          cursorClickSound.stop();
          cursorClickSound.play();
        } else {
          cursorClickSound.stop();
          cursorClickSound.play();
        }
        
        // Stop after a short delay
        setTimeout(() => {
          cursorClickSound.mute(false);
        }, 100);
      } catch (error) {
        console.log('Audio prompt failed:', error);
      }
    };

    // Play welcome sound on first interaction or load
    const timer = setTimeout(playWelcomePrompt, 500);
    
    return () => clearTimeout(timer);
  }, [currentLocale]);

  // Mouse move handler with badge detection
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      
      // Track the target element for badge detection
      trackBadgeText(e.target as Element);
    };

    const handleDown = () => {
      setClicking(true);
      try {
        cursorClickSound.stop();
        cursorClickSound.play();
      } catch (error) {
        console.log('Audio play failed:', error);
      }
    };

    const handleUp = () => {
      setClicking(false);
    };

    window.addEventListener('mousemove', handleMove, false);
    window.addEventListener('mousedown', handleDown, false);
    window.addEventListener('mouseup', handleUp, false);
    
    return () => {
      window.removeEventListener('mousemove', handleMove as EventListener, false);
      window.removeEventListener('mousedown', handleDown as EventListener, false);
      window.removeEventListener('mouseup', handleUp as EventListener, false);
    };
  }, [trackBadgeText]);

  // Animate outer ring independently for parallax effect
  useEffect(() => {
    const unsubscribeX = cursorX.on('change', (latest) => {
      animate(outerRingX, latest * 0.15, { type: 'spring', damping: 25, stiffness: 180 });
    });
    
    return () => {
      unsubscribeX();
    };
  }, []);

  // Hover animation for clickable elements
  useEffect(() => {
    if (isHovered) {
      animate(hoverScale, 1.3, { type: 'spring', damping: 25, stiffness: 180 });
      cursorX.set(0);
      cursorY.set(0);
    } else {
      animate(hoverScale, 1, { type: 'spring', damping: 25, stiffness: 180 });
    }

    return () => {};
  }, [isHovered]);

  // Click animation for the innermost circle
  useEffect(() => {
    if (clicking) {
      animate(scale, 0.7, { type: 'spring', damping: 25, stiffness: 180 });
    } else {
      animate(scale, 1, { type: 'spring', damping: 25, stiffness: 180 });
    }

    return () => {};
  }, [clicking]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      cursorClickSound.unload();
    };
  }, []);

  return (
    <>
      {/* Outer animated ring - expands on hover of clickable elements */}
      <motion.div
        style={{
          x: outerRingX,
          y: pos.y - 80, // Position at mouse Y
          scale: hoverScale,
        }}
        className={`absolute rounded-full border border-emerald-500/40 pointer-events-none transition-all duration-300 ${
          isHovered ? 'w-[160px] h-[160px]' : 'w-[20px] h-[20px]'
        }`}
        animate={{ opacity: isHovered ? 0.8 : 0 }}
        initial={{ scale: 0, opacity: 0 }}
      />

      {/* Badge tooltip - shows when hovering over elements with badge attribute */}
      <motion.div
        className="fixed pointer-events-none z-[1000] px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-medium shadow-lg whitespace-nowrap"
        style={{
          left: dir === 'rtl' ? undefined : pos.x + 26,
          right: dir === 'ltr' ? undefined : pos.x - 84,
          top: pos.y - 30,
          transformOrigin: dir === 'rtl' ? 'right center' : 'left center',
        }}
        initial={{ scale: 0.8, opacity: 0, y: -10 }}
        animate={{ 
          scale: isHovered && badgeText.current ? [0.95, 1] : 0.95,
          opacity: isHovered && badgeText.current ? 1 : 0,
          y: (isHovered && badgeText.current) ? 0 : -10,
        }}
        transition={{ duration: 0.2, type: 'spring', damping: 25, stiffness: 300 }}
      >
        {badgeText.current}
      </motion.div>

      {/* Innermost circle - tracks cursor with spring animation */}
      <div
        style={{
          x: cursorX,
          y: pos.y - 4,
          opacity: 1,
          scale,
        }}
        className="w-2 h-2 bg-emerald-500 rounded-full pointer-events-none z-[100]"
      />

      {/* Outer ring - follows cursor with delay */}
      <div
        style={{
          x: pos.x - 20,
          y: pos.y - 20,
          opacity: isHovered ? 0.8 : 0.3,
          borderColor: isHovered ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.3)',
        }}
        className="w-10 h-10 border border-emerald-500/30 rounded-full pointer-events-none z-[99]"
      />

      {/* Central dot - always centered */}
      <motion.div
        style={{ x: pos.x, y: pos.y }}
        className="w-1 h-1 bg-emerald-500 rounded-full pointer-events-none z-[101]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

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

      {/* Hover state indicator for clickable elements - pulsing dot at cursor */}
      {isHovered && (
        <motion.div
          className="absolute w-1 h-1 bg-emerald-300 rounded-full pointer-events-none"
          style={{ x: pos.x, y: pos.y }}
          initial={{ opacity: 0 }}
          animate={{ 
            scale: [0.8, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }}
        />
      )}

      {/* Debug info - shows current direction */}
      <div 
        className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]"
        style={{ display: dir === 'rtl' ? 'block' : 'none' }}
      >
        RTL Mode
      </div>

      {/* LTR indicator for left-to-right layouts */}
      <div 
        className="fixed bottom-2 right-2 text-[10px] text-emerald-500/50 z-[999]"
        style={{ display: dir === 'ltr' ? 'block' : 'none' }}
      >
        LTR Mode
      </div>

      <style>{`
        .no-cursor-hover {
          --tw-ring-offset-width: 0 !important;
        }
        
        /* Custom cursor styles for interactive elements */
        a:not(.not-custom-cursor), 
        button, 
        input, 
        select, 
        textarea,
        [role="button"],
        .cursor-pointer {
          outline: none;
        }
      `}</style>
    </>
  );
};

export default CustomCursor;