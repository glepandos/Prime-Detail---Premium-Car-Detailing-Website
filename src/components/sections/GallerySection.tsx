'use client';

import { useState, useRef, type PointerEvent, type KeyboardEvent } from 'react';
import Image from 'next/image';

const PAIRS = [
  { id: 'wash-finish', title: 'From wash to finish', category: 'Exterior care', before: 'wash', after: 'ferrari', beforeAlt: 'Red sports car rear bumper covered in foam', afterAlt: 'Red Ferrari with glossy paintwork' },
  { id: 'polish-protect', title: 'Polish and protect', category: 'Paintwork', before: 'coating', after: 'beading', beforeAlt: 'Machine polishing a dark car body panel', afterAlt: 'Water droplets on red Ferrari paintwork' },
];

type Pair = (typeof PAIRS)[number];

function BeforeAfterSlider({ pair }: { pair: Pair }) {
  const [position, setPosition] = useState(50);
  const container = useRef<HTMLDivElement>(null);
  const update = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = container.current?.getBoundingClientRect();
    if (bounds) setPosition(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
  };
  const keyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const values: Record<string, number> = { ArrowLeft: position - 2, ArrowRight: position + 2, ArrowDown: position - 2, ArrowUp: position + 2, PageDown: position - 10, PageUp: position + 10, Home: 0, End: 100 };
    if (event.key in values) { event.preventDefault(); setPosition(Math.max(0, Math.min(100, values[event.key]))); }
  };
  return (
    <div ref={container} role="slider" tabIndex={0} aria-label="Before and after photo comparison" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} aria-valuetext={`${Math.round(position)} percent before photo`} aria-describedby="comparison-help" onKeyDown={keyboard}
      onPointerDown={(event) => { event.preventDefault(); event.currentTarget.focus(); event.currentTarget.setPointerCapture(event.pointerId); update(event); }}
      onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event); }}
      onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
      className="relative aspect-[4/3] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black md:aspect-[16/9]">
      <Image src={`/images/editorial/${pair.after}.jpg`} alt={pair.afterAlt} fill sizes="(max-width: 1280px) 100vw, 1280px" className="pointer-events-none object-cover" draggable={false} />
      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src={`/images/editorial/${pair.before}.jpg`} alt={pair.beforeAlt} fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" draggable={false} />
      </div>
      <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-widest text-white">Before</div>
      <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs uppercase tracking-widest text-emerald-300">After</div>
      <div className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-white/90 shadow-lg" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
        <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/70 text-white shadow-xl backdrop-blur-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m8 7-5 5 5 5m8-10 5 5-5 5M10 8v8m4-8v8" /></svg>
        </div>
      </div>
      <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/65 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/80">Illustrative photo pair</span>
    </div>
  );
}

export const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = PAIRS[activeIndex];
  const change = (step: number) => setActiveIndex((index) => (index + step + PAIRS.length) % PAIRS.length);
  return (
    <section id="gallery" className="relative bg-black px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-6 inline-block rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs uppercase tracking-widest text-emerald-400">In focus</span>
            <h2 className="text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">A closer look<br /><span className="text-emerald-400">at every detail.</span></h2>
          </div>
          <div className="max-w-sm text-base leading-relaxed text-white/50"><p>Move the slider to explore before and after views.</p><p className="mt-3 text-xs text-white/40">Demo pairs use different stock photographs. They do not show the same vehicle or an actual treatment result.</p></div>
        </div>
        <BeforeAfterSlider key={current.id} pair={current} />
        <div className="my-6 flex items-center justify-between gap-4">
          <div aria-live="polite"><p className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-300">{current.category}</p><h3 className="text-xl font-light text-white md:text-3xl">{current.title}</h3></div>
          <div className="flex shrink-0 gap-2">
            <button aria-label="Previous photo pair" onClick={() => change(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m15 5-7 7 7 7" /></svg></button>
            <button aria-label="Next photo pair" onClick={() => change(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white hover:bg-white/10"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 5 7 7-7 7" /></svg></button>
          </div>
        </div>
        <div className="grid max-w-md grid-cols-2 gap-3">
          {PAIRS.map((pair, index) => <button key={pair.id} onClick={() => setActiveIndex(index)} aria-label={`View ${pair.title.toLowerCase()} pair`} aria-pressed={index === activeIndex} className={`relative aspect-[16/9] overflow-hidden rounded-lg transition-opacity ${index === activeIndex ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'}`}><Image src={`/images/editorial/${pair.after}.jpg`} alt={pair.afterAlt} fill sizes="220px" className="object-cover" /><span className="absolute inset-x-0 bottom-0 bg-black/65 p-2 text-xs text-white">{pair.title}</span></button>)}
        </div>
        <p id="comparison-help" className="mt-6 text-xs leading-relaxed text-white/40">Drag the divider, tap a position, or use the arrow keys. Photography from Pexels; illustrative examples, not completed client work.</p>
      </div>
    </section>
  );
};
