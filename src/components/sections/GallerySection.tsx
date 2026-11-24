'use client';

import { useState } from 'react';
import Image from 'next/image';

const PHOTOS = [
  { id: 'ferrari', title: 'Sculpted reflections', category: 'Paintwork', alt: 'Front view of a red Ferrari with reflections across its hood' },
  { id: 'polishing', title: 'Clarity, one panel at a time', category: 'Paint correction', alt: 'A detailing specialist machine polishing a white car hood' },
  { id: 'beading', title: 'Every drop, every detail', category: 'Surface care', alt: 'Water droplets on the red bodywork of a Ferrari' },
  { id: 'interior', title: 'Care from the inside out', category: 'Interior', alt: 'Detailed view of a leather and carbon fibre Ferrari steering wheel' },
  { id: 'wheels', title: 'The finishing touches', category: 'Wheel care', alt: 'Cleaning the polished wheel of a classic car by hand' },
  { id: 'wash', title: 'A clean beginning', category: 'Decontamination', alt: 'Foam covering the rear bumper and exhausts of a red sports car' },
];

export const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = PHOTOS[activeIndex];
  const change = (step: number) => setActiveIndex((index) => (index + step + PHOTOS.length) % PHOTOS.length);
  return (
    <section id="gallery" className="relative bg-black px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mb-6 inline-block rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-xs uppercase tracking-widest text-emerald-400">In focus</span>
            <h2 className="text-4xl font-light leading-tight tracking-tight text-white md:text-6xl">A closer look<br /><span className="text-emerald-400">at every detail.</span></h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-white/50">Paintwork, surfaces and the craft of automotive care. Explore the details that inspire our approach.</p>
        </div>
        <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-white/5 md:aspect-[16/9]" aria-roledescription="carousel" aria-label="Automotive detailing photography">
          <Image key={current.id} src={`/images/editorial/${current.id}.jpg`} alt={current.alt} fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-cover" style={{ objectPosition: current.id === 'beading' ? 'center 65%' : 'center' }} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 p-5 md:p-8">
            <div aria-live="polite">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-emerald-300">{current.category}</p>
              <h3 className="text-xl font-light text-white md:text-3xl">{current.title}</h3>
            </div>
            <div className="flex shrink-0 gap-2">
              <button aria-label="Previous photograph" onClick={() => change(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white hover:bg-white/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m15 5-7 7 7 7" /></svg></button>
              <button aria-label="Next photograph" onClick={() => change(1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-black/40 text-white hover:bg-white/20"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m9 5 7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
          {PHOTOS.map((photo, index) => <button key={photo.id} onClick={() => setActiveIndex(index)} aria-label={`View ${photo.category.toLowerCase()} photograph`} aria-pressed={index === activeIndex} className={`relative aspect-[4/3] overflow-hidden rounded-lg transition-opacity ${index === activeIndex ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black' : 'opacity-60 hover:opacity-100'}`}><Image src={`/images/editorial/${photo.id}.jpg`} alt={photo.alt} fill sizes="(max-width: 768px) 30vw, 200px" className="object-cover" /></button>)}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-white/40">Editorial imagery from Pexels, used to illustrate detailing and automotive care. These photographs are not a portfolio of completed client work.</p>
      </div>
    </section>
  );
};
