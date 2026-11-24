'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { HorizontalScroll } from '@/components/three/HorizontalScroll';

// Dynamic imports for heavy components
const DetailingScene = dynamic(() => import('@/components/three/DetailingScene').then((mod) => mod.DetailingScene), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black z-0" />,
});

const ServiceTiers = dynamic(() => import('@/components/ui/ServiceTiers').then((mod) => mod.ServiceTiers), {
  ssr: false,
  loading: () => <div className="h-96" />,
});

const BookingForm = dynamic(() => import('@/components/ui/BookingForm').then((mod) => mod.BookingForm), {
  ssr: false,
  loading: () => <div className="h-96" />,
});

const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection').then((mod) => mod.ProcessSection), {
  ssr: false,
  loading: () => <div className="h-96" />,
});

const GallerySection = dynamic(() => import('@/components/sections/GallerySection').then((mod) => mod.GallerySection), {
  ssr: false,
  loading: () => <div className="h-96" />,
});

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStageChange = useCallback((stage: number) => {
    setCurrentStage(stage);
  }, []);

  return (
    <div className="relative min-h-screen material-background text-white overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Horizontal Scroll Experience */}
      <HorizontalScroll
        scrollProgress={scrollProgress}
        setScrollProgress={setScrollProgress}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
        onStageChange={handleStageChange}
      >
        <DetailingScene currentStage={currentStage} scrollProgress={scrollProgress} />
      </HorizontalScroll>

      {/* Content Sections (Vertical Scroll After Horizontal) */}
      <div className="relative z-20">
        <ServiceTiers />
        <ProcessSection />
        <GallerySection />
        <BookingForm />
        <Footer />
      </div>

      {/* Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 material-background z-50 flex items-center justify-center animate-fade-out">
          <div className="text-center">
            <svg width="80" height="80" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 text-emerald-400 animate-spin">
              <defs>
                <linearGradient id="loadGradient" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#00D4AA" />
                  <stop offset="100%" stopColor="#0066FF" />
                </linearGradient>
              </defs>
              <path d="M16 2 L28 10 V22 L16 30 L4 22 V10 Z" stroke="url(#loadGradient)" strokeWidth="2" strokeLinejoin="round" />
              <path d="M16 8 L16 24 M8 16 L24 16" stroke="url(#loadGradient)" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="16" r="4" fill="url(#loadGradient)" />
            </svg>
            <p className="text-white/50 text-sm tracking-widest uppercase">Prime Detail</p>
            <p className="text-white/30 text-xs mt-2">Loading experience...</p>
          </div>
        </div>
      )}
    </div>
  );
}
