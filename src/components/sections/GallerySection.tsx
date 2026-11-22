'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const GALLERY_IMAGES = [
  {
    id: 'porsche-911',
    title: 'Porsche 911 GT3',
    service: 'Paint Correction + Ceramic Pro',
    before: '/images/gallery/porsche-before.jpg',
    after: '/images/gallery/porsche-after.jpg',
    color: '#C0392B',
  },
  {
    id: 'tesla-model-s',
    title: 'Tesla Model S Plaid',
    service: 'Ceramic Pro Plus Package',
    before: '/images/gallery/tesla-before.jpg',
    after: '/images/gallery/tesla-after.jpg',
    color: '#E8E8E8',
  },
  {
    id: 'bmw-m4',
    title: 'BMW M4 Competition',
    service: 'Paint Correction + Wheel Coating',
    before: '/images/gallery/bmw-before.jpg',
    after: '/images/gallery/bmw-after.jpg',
    color: '#0D1B2A',
  },
  {
    id: 'mercedes-g',
    title: 'Mercedes-AMG G63',
    service: 'Full Ceramic Pro Plus',
    before: '/images/gallery/g63-before.jpg',
    after: '/images/gallery/g63-after.jpg',
    color: '#1A1A2E',
  },
  {
    id: 'ferrari-488',
    title: 'Ferrari 488 Pista',
    service: 'Paint Correction + PPF Prep',
    before: '/images/gallery/ferrari-before.jpg',
    after: '/images/gallery/ferrari-after.jpg',
    color: '#FF2800',
  },
  {
    id: 'audi-rs6',
    title: 'Audi RS6 Avant',
    service: 'Essential Detail + Glass Coating',
    before: '/images/gallery/audi-before.jpg',
    after: '/images/gallery/audi-after.jpg',
    color: '#0A0A0A',
  },
];

export const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; index: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    setDragStart({ x: e.clientX, index });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    const delta = dragStart.x - e.clientX;
    if (Math.abs(delta) > 50) {
      const direction = delta > 0 ? 1 : -1;
      setActiveIndex((prev) => (prev + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length);
      setDragStart(null);
    }
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragStart]);

  const currentImage = GALLERY_IMAGES[activeIndex];

  return (
    <section id="gallery" className="relative py-24 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block px-4 py-1.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs tracking-widest uppercase rounded-full mb-6">
            Recent Work
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6">
            Transformations<br />
            <span className="text-emerald-400">That Speak</span>
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Real vehicles. Real results. Swipe to compare before & after.
          </p>
        </div>

        {/* Main Comparison Viewer */}
        <div className="relative mb-12">
          <BeforeAfterSlider
            beforeSrc={currentImage.before}
            afterSrc={currentImage.after}
            alt={`${currentImage.title} before and after detailing`}
          />

          {/* Vehicle Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/90 to-transparent">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentImage.color }}
                  />
                  <span className="text-white/50 text-sm tracking-wide uppercase">{currentImage.service}</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-light text-white tracking-tight">
                  {currentImage.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span>Drag or click to compare</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="relative">
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {GALLERY_IMAGES.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-40 md:w-48 h-28 md:h-32 rounded-xl overflow-hidden scroll-snap-center transition-all duration-500 ${
                  index === activeIndex
                    ? 'ring-2 ring-emerald-400/50 scale-105 shadow-lg shadow-emerald-400/20'
                    : 'opacity-50 hover:opacity-80'
                }`}
                aria-label={`View ${image.title}`}
                aria-current={index === activeIndex ? 'true' : 'false'}
              >
                <Image
                  src={image.after}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="160px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white text-xs font-medium truncate">
                  {image.title}
                </div>
              </button>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {GALLERY_IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-emerald-400 w-8'
                    : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  alt: string;
}

const BeforeAfterSlider = ({ beforeSrc, afterSrc, alt }: BeforeAfterSliderProps) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const newPosition = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPosition(newPosition);
  };

  const handleStart = () => {
    isDraggingRef.current = true;
  };

  const handleEnd = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/3"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseUp={handleEnd}
      onTouchEnd={handleEnd}
      onMouseLeave={handleEnd}
      role="img"
      aria-label={alt}
    >
      {/* Before Image */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)` }}>
        <Image
          src={beforeSrc}
          alt={`${alt} - before`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 bg-black/60 backdrop-blur text-white/80 text-xs tracking-widest uppercase rounded-full">
            Before
          </span>
        </div>
      </div>

      {/* After Image */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `polygon(${position}% 0, 100% 0, 100% 100%, ${position}% 100%)` }}>
        <Image
          src={afterSrc}
          alt={`${alt} - after`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1.5 bg-emerald-400/20 backdrop-blur text-emerald-400 text-xs tracking-widest uppercase rounded-full border border-emerald-400/30">
            After
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-1 flex items-center justify-center pointer-events-none"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="relative z-10">
          <div className="w-1 h-full bg-gradient-to-b from-emerald-400/50 via-emerald-400 to-emerald-400/50" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-black border-2 border-emerald-400 rounded-full flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Instruction */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-wide uppercase">
        Drag to compare
      </div>
    </div>
  );
};