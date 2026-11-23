'use client';
import React from 'react';
import { STAGES } from './DetailingScene';
interface Props {
  children: React.ReactNode;
  currentStage?: number;
  setCurrentStage?: (stage: number) => void;
  onStageChange?: (stage: number) => void;
  scrollProgress?: number;
  setScrollProgress?: (progress: number) => void;
}
export const HorizontalScroll = ({ children, currentStage = 2, setCurrentStage, onStageChange }: Props) => (
  <section id="hero" className="relative w-full overflow-hidden bg-[#11191f]" style={{ height: 'min(920px, 100svh)', minHeight: 600 }}>
    {children}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/80 to-transparent" />
    <div className="pointer-events-none absolute left-6 bottom-32 z-10 max-w-xs md:left-12 md:bottom-12">
      <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-emerald-300">The detailing studio</p>
      <h1 className="text-3xl font-light tracking-tight text-white md:text-4xl">{STAGES[currentStage].name}</h1>
      <p className="mt-3 max-w-[250px] text-sm leading-relaxed text-white/60">{STAGES[currentStage].description}</p>
    </div>
    <div className="absolute bottom-8 left-6 right-6 z-10 flex gap-2 md:left-auto md:right-12 md:bottom-12" aria-label="Detailing stages">
      {STAGES.map((stage, index) => <button key={stage.id} aria-pressed={currentStage === index} onClick={() => { setCurrentStage?.(index); onStageChange?.(index); }} className={`flex-1 rounded-full border px-4 py-3 text-xs transition-colors md:flex-none ${currentStage === index ? 'border-emerald-300/60 bg-emerald-300/10 text-emerald-200' : 'border-white/15 bg-black/30 text-white/60 hover:border-white/40'}`}>{['Before', 'Correction', 'Ceramic'][index]}</button>)}
    </div>
    <a href="https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6" target="_blank" rel="noreferrer" className="absolute right-6 top-24 z-10 text-[9px] tracking-wide text-white/40 md:right-12">458 Italia · vicent091036 · CC BY</a>
  </section>
);
export const StageSection = ({ children }: { children: React.ReactNode; id: string }) => <>{children}</>;
