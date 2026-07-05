import React, { useEffect, useRef } from 'react';

class Pixel {
  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private x: number;
  private y: number;
  private color: string;
  private speed: number;
  private size: number = 0;
  private sizeStep: number;
  private minSize: number = 0.5;
  private maxSizeInteger: number = 2;
  private maxSize: number;
  private delay: number;
  private counter: number = 0;
  private counterStep: number;
  isIdle: boolean = false;
  private isReverse: boolean = false;
  private isShimmer: boolean = false;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, x: number, y: number, color: string, speed: number, delay: number) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.sizeStep = Math.random() * 0.4;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
  }

  private getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  draw(): void {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
        this.x + centerOffset,
        this.y + centerOffset,
        this.size,
        this.size
    );
  }

  appear(): void {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear(): void {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }

    this.draw();
  }

  shimmer(): void {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }
}

interface PixelCanvasProps {
  colors?: string[];
  gap?: number;
  speed?: number;
  noFocus?: boolean;
  className?: string;
}

const getDistanceToCanvasCenter = (x: number, y: number, width: number, height: number): number => {
  const dx = x - width / 2;
  const dy = y - height / 2;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance;
};

export const PixelCanvas: React.FC<PixelCanvasProps> = ({
                                                          colors = ["#f8fafc", "#f1f5f9", "#cbd5e1"],
                                                          gap = 5,
                                                          speed = 35,
                                                          noFocus = false,
                                                          className = ""
                                                        }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<number | null>(null);
  const reducedMotionRef = useRef<boolean>(false);

  const throttledSpeed = speed > 0 ? speed * 0.001 : 0;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mediaQuery.matches;

    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      pixelsRef.current = [];

      for (let x = 0; x < width; x += gap) {
        for (let y = 0; y < height; y += gap) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const delay = reducedMotionRef.current ? 0 : getDistanceToCanvasCenter(x, y, width, height);

          pixelsRef.current.push(
              new Pixel(canvas, ctx, x, y, color, throttledSpeed, delay)
          );
        }
      }
    };

    const animate = (fnName: 'appear' | 'disappear') => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      animationRef.current = requestAnimationFrame(() => animate(fnName));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < pixelsRef.current.length; i++) {
        pixelsRef.current[i][fnName]();
      }

      if (pixelsRef.current.every(pixel => pixel.isIdle)) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    };

    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      animate('appear');
    };

    const handleMouseLeave = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      animate('disappear');
    };

    const resizeObserver = new ResizeObserver(initCanvas);
    const canvas = canvasRef.current;

    if (canvas) {
      resizeObserver.observe(canvas);
      initCanvas();

      // Start the appear animation initially
      animate('appear');

      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);

      if (!noFocus) {
        canvas.addEventListener('focusin', handleMouseEnter);
        canvas.addEventListener('focusout', handleMouseLeave);
      }
    }

    return () => {
      resizeObserver.disconnect();
      if (canvas) {
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);

        if (!noFocus) {
          canvas.removeEventListener('focusin', handleMouseEnter);
          canvas.removeEventListener('focusout', handleMouseLeave);
        }
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [colors, gap, throttledSpeed, noFocus]);

  return (
      <canvas
          ref={canvasRef}
          className={className}
          style={{ display: 'block', width: '100%', height: '100%' }}
      />
  );
};