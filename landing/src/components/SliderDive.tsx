import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Certificate } from "@/src/types.ts";

export const SliderDive: React.FC<{ certificates: Certificate[] }> = ({ certificates }) => {
    const [images, setImages] = useState<string[]>(
        certificates.map((certificate) => certificate.certificate)
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoplaying, setIsAutoplaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate visible items based on container width
    const getVisibleItems = useCallback(() => {
        if (!containerRef.current) return 1;
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = 58; // 50px width + 8px gap
        return Math.floor(containerWidth / itemWidth);
    }, []);

    const scrollToIndex = useCallback((index: number) => {
        if (!containerRef.current || index < 0 || index >= images.length) return;

        const scrollPosition = index * 58; // item width + gap
        containerRef.current.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        setCurrentIndex(index);
    }, [images.length]);

    const handleNext = useCallback(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        scrollToIndex(nextIndex);
    }, [currentIndex, images.length, scrollToIndex]);

    const handlePrev = useCallback(() => {
        const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        scrollToIndex(prevIndex);
    }, [currentIndex, images.length, scrollToIndex]);

    // Autoplay functionality
    useEffect(() => {
        if (isAutoplaying && !isHovered && images.length > 1) {
            autoplayIntervalRef.current = setInterval(() => {
                handleNext();
            }, 3000); // Change slide every 3 seconds
        }

        return () => {
            if (autoplayIntervalRef.current) {
                clearInterval(autoplayIntervalRef.current);
            }
        };
    }, [isAutoplaying, isHovered, images.length, handleNext]);

    // Handle scroll event to update current index
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const scrollPosition = containerRef.current.scrollLeft;
            const newIndex = Math.round(scrollPosition / 58);

            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
                setCurrentIndex(newIndex);
            }
        };

        const container = containerRef.current;
        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [currentIndex, images.length]);

    // Pause autoplay on hover
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            className="relative w-full py-6"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slider Container */}
            <div
                ref={containerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth px-14"
                style={{
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'x mandatory',
                    scrollBehavior: 'smooth'
                }}
            >
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`relative flex-shrink-0 w-[150px] h-[150px]  p-2 transition-all duration-300 group`}

                        onClick={() => scrollToIndex(index)}
                    >
                        <div className="absolute inset-0 w-full h-full overflow-hidden">
                            <div dangerouslySetInnerHTML={{ __html: src }} />
                        </div>
                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
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
                                ? 'bg-white w-6'
                                : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Autoplay Toggle */}
            <button
                onClick={() => setIsAutoplaying(!isAutoplaying)}
                className="absolute bottom-2 right-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 transition-all duration-300"
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