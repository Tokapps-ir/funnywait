import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Certificate } from "@/src/types";

export const SliderDive: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => {
    // Dynamic array from props
    const images = certificates.map((certificate) => certificate.certificate);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoplaying, setIsAutoplaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Drag and Drop (Mouse Slide) State
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeftRef = useRef(0);

    // Item dimension: 150px width + 16px gap = 166px
    const ITEM_WIDTH = 166;

    const scrollToIndex = useCallback((index: number) => {
        if (!containerRef.current || index < 0 || index >= images.length) return;

        const scrollPosition = index * ITEM_WIDTH;
        containerRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        setCurrentIndex(index);
    }, [images.length]);

    const handleNext = useCallback(() => {
        if (images.length === 0) return;
        const nextIndex = (currentIndex + 1) % images.length;
        scrollToIndex(nextIndex);
    }, [currentIndex, images.length, scrollToIndex]);

    const handlePrev = useCallback(() => {
        if (images.length === 0) return;
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        scrollToIndex(prevIndex);
    }, [currentIndex, images.length, scrollToIndex]);

    // Drag-to-slide mouse events
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        isDown.current = true;
        containerRef.current.style.scrollBehavior = 'auto'; // Disable smooth scroll while dragging
        startX.current = e.pageX - containerRef.current.offsetLeft;
        scrollLeftRef.current = containerRef.current.scrollLeft;
    };

    const handleMouseLeaveOrUp = () => {
        if (!isDown.current || !containerRef.current) return;
        isDown.current = false;
        containerRef.current.style.scrollBehavior = 'smooth';

        // Snap to nearest item after drag completes
        const scrollPosition = containerRef.current.scrollLeft;
        const nearestIndex = Math.round(scrollPosition / ITEM_WIDTH);
        scrollToIndex(nearestIndex);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDown.current || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // Drag speed multiplier
        containerRef.current.scrollLeft = scrollLeftRef.current - walk;
    };

    // Autoplay functionality
    useEffect(() => {
        if (isAutoplaying && !isHovered && images.length > 1) {
            autoplayIntervalRef.current = setInterval(() => {
                handleNext();
            }, 3000);
        }

        return () => {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
        };
    }, [isAutoplaying, isHovered, images.length, handleNext]);

    // Passive scroll listener (no index dependencies to prevent loops)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollPosition = container.scrollLeft;
            const newIndex = Math.round(scrollPosition / ITEM_WIDTH);

            // Only state update if value actually shifted
            setCurrentIndex((prev) => {
                if (newIndex >= 0 && newIndex < images.length && newIndex !== prev) {
                    return newIndex;
                }
                return prev;
            });
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, [images.length]);

    if (!images.length) return null;

    return (
        <div
            className="group relative w-[350px] py-6 select-none" // added 'group' here so buttons can detect hover
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                handleMouseLeaveOrUp();
            }}
        >
            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slider Container */}
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide  cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseLeaveOrUp}
                onMouseMove={handleMouseMove}
                style={{
                    WebkitOverflowScrolling: 'touch',
                }}
            >
                {images.map((src, index) => (
                    <div
                        key={index}
                        className="relative flex-shrink-0 w-[150px] h-[150px] p-2 transition-all duration-300 pointer-events-none" // pointer-events-none ensures seamless dragging over HTML content
                    >
                        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-xl">
                            <div dangerouslySetInnerHTML={{ __html: src }} />
                        </div>
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none" />
                    </div>
                ))}
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center mt-4 gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentIndex
                                ? 'bg-blue-600 w-6' // Changed white to distinct color if background is light
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Autoplay Toggle */}
            <button
                onClick={() => setIsAutoplaying(!isAutoplaying)}
                className="absolute bottom-2 right-2 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
                aria-label={isAutoplaying ? 'Pause autoplay' : 'Start autoplay'}
            >
                {isAutoplaying ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default SliderDive;