'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { STAGES } from './DetailingScene';

gsap.registerPlugin(ScrollTrigger);

interface HorizontalScrollProps {
  children: React.ReactNode;
  onStageChange?: (stage: number) => void;
  scrollProgress?: number;
  setScrollProgress?: (progress: number) => void;
  currentStage?: number;
  setCurrentStage?: (stage: number) => void;
}

export const HorizontalScroll = ({
  children,
  onStageChange,
  setScrollProgress,
  currentStage = 0,
  setCurrentStage,
}: HorizontalScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Set up horizontal scroll with GSAP ScrollTrigger
  useEffect(() => {
    if (!containerRef.current || !scrollRef.current) return;

    const container = containerRef.current;
    const scrollContainer = scrollRef.current;

    // Calculate total scroll distance
    const scrollWidth = scrollContainer.scrollWidth;
    const viewportWidth = window.innerWidth;
    const totalScroll = scrollWidth - viewportWidth;

    // Create scroll triggers for each stage
    STAGES.forEach((stage, index) => {
      const stageElement = document.getElementById(`stage-${stage.id}`);
      if (!stageElement) return;

      const trigger = ScrollTrigger.create({
        trigger: stageElement,
        start: 'left center',
        end: 'right center',
        horizontal: true,
        scroller: container,
        onEnter: () => {
          if (setCurrentStage) setCurrentStage(index);
          if (onStageChange) onStageChange(index);
        },
        onEnterBack: () => {
          if (setCurrentStage) setCurrentStage(index);
          if (onStageChange) onStageChange(index);
        },
        onLeave: () => {
          // Optional: handle leave
        },
        onLeaveBack: () => {
          // Optional: handle leave back
        },
        onUpdate: (self) => {
          const stageProgress = self.progress;
          const globalProgress = (index + stageProgress) / STAGES.length;
          if (setScrollProgress) setScrollProgress(globalProgress);
        },
      });

      scrollTriggersRef.current.push(trigger);
    });

    // Main horizontal scroll trigger
    const mainTrigger = ScrollTrigger.create({
      trigger: scrollContainer,
      start: 'left left',
      end: `+=${totalScroll}`,
      horizontal: true,
      scroller: container,
      scrub: 1,
      onUpdate: (self) => {
        if (setScrollProgress) setScrollProgress(self.progress);
        // Sync Lenis with ScrollTrigger
        if (lenisRef.current) {
          lenisRef.current.scrollTo(self.progress * totalScroll, { immediate: false });
        }
      },
    });

    scrollTriggersRef.current.push(mainTrigger);

    // Sync Lenis scroll with ScrollTrigger
    const syncScroll = () => {
      if (lenisRef.current && containerRef.current) {
        ScrollTrigger.update();
      }
    };

    const lenis = lenisRef.current;
    if (lenis) {
      lenis.on('scroll', syncScroll);
    }

    return () => {
      scrollTriggersRef.current.forEach((trigger) => trigger.kill());
      scrollTriggersRef.current = [];
      lenis?.off('scroll', syncScroll);
    };
  }, [onStageChange, setScrollProgress, setCurrentStage]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lenisRef.current || !containerRef.current) return;

      const scrollContainer = scrollRef.current;
      if (!scrollContainer) return;

      const scrollWidth = scrollContainer.scrollWidth;
      const viewportWidth = window.innerWidth;
      const totalScroll = scrollWidth - viewportWidth;
      const stageWidth = totalScroll / STAGES.length;

      let targetScroll = lenisRef.current.animatedScroll;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          targetScroll = Math.min(targetScroll + stageWidth, totalScroll);
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          targetScroll = Math.max(targetScroll - stageWidth, 0);
          break;
        case 'Home':
          e.preventDefault();
          targetScroll = 0;
          break;
        case 'End':
          e.preventDefault();
          targetScroll = totalScroll;
          break;
      }

      lenisRef.current.scrollTo(targetScroll, { duration: 1 });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to specific stage
  const scrollToStage = useCallback((stageIndex: number) => {
    if (!lenisRef.current || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    const scrollWidth = scrollContainer.scrollWidth;
    const viewportWidth = window.innerWidth;
    const totalScroll = scrollWidth - viewportWidth;
    const stageWidth = totalScroll / STAGES.length;

    const targetScroll = stageIndex * stageWidth + stageWidth / 2;
    lenisRef.current.scrollTo(targetScroll, { duration: 1.2 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden"
      style={{ overflow: 'hidden' }}
    >
      <div
        ref={scrollRef}
        className="flex h-full"
        style={{ width: `${STAGES.length * 100}vw` }}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement, {
            id: `stage-${STAGES[index]?.id || index}`,
            style: {
              width: '100vw',
              flexShrink: 0,
              ...(child.props.style || {}),
            },
          });
        })}
      </div>

      {/* Progress indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-4">
        {STAGES.map((stage, index) => (
          <button
            key={stage.id}
            onClick={() => scrollToStage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentStage
                ? 'bg-white scale-150 shadow-lg shadow-white/50'
                : 'bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to ${stage.name}`}
            style={{ boxShadow: index === currentStage ? `0 0 20px ${stage.color}` : 'none' }}
          />
        ))}
      </div>

      {/* Stage indicator */}
      <div className="fixed left-8 bottom-8 z-50 max-w-xs">
        <div className="text-white/90 font-light text-sm tracking-widest uppercase mb-2">
          Stage {currentStage + 1} of {STAGES.length}
        </div>
        <h2 className="text-3xl font-light text-white leading-tight">
          {STAGES[currentStage]?.name || ''}
        </h2>
        <p className="text-white/50 mt-2 text-base leading-relaxed max-w-md">
          {STAGES[currentStage]?.description || ''}
        </p>
      </div>

      {/* Scroll hint */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 text-white/40 animate-bounce">
        <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// Section wrapper for each stage
interface StageSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const StageSection = ({ id, children, className = '', style }: StageSectionProps) => (
  <section
    id={id}
    className={`relative flex h-full items-center justify-center ${className}`}
    style={style}
  >
    {children}
  </section>
);