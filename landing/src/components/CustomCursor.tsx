import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    const handleDown = () => setClicking(true);
    const handleUp = () => setClicking(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <>
      <motion.div
        animate={{
          x: pos.x - 4,
          y: pos.y - 4,
          scale: clicking ? 0.5 : 1,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 200, mass: 0.5 }}
        className="w-2 h-2 bg-emerald-500 rounded-full fixed pointer-events-none z-[100]"
      />
      <motion.div
        animate={{
          x: pos.x - 20,
          y: pos.y - 20,
          scale: clicking ? 1.5 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 100, mass: 0.8 }}
        className="w-10 h-10 border border-emerald-500/30 rounded-full fixed pointer-events-none z-[100]"
      />
    </>
  );
};