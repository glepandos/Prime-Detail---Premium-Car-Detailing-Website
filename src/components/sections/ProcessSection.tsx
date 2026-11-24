'use client';

import { useState } from 'react';
import Image from 'next/image';

const PROCESS_STEPS = [
  {
    number: '01',
    title: 'Decontamination',
    description: 'Iron fallout removal, clay bar treatment, and tar/adhesive removal. This prepares the clear coat for correction by eliminating bonded contaminants that cause marring.',
    details: ['Iron X fallout remover', 'Fine-grade clay bar', 'Tar & adhesive remover', 'Final rinse & inspection'],
    duration: '60-90 min',
    icon: 'droplets',
    image: '/images/editorial/wash.jpg',
    imageAlt: 'Foam washing on the rear bumper of a red sports car',
  },
  {
    number: '02',
    title: 'Paint Correction',
    description: 'Multi-stage machine polishing using Rupes/ Flex systems. We remove swirls, scratches, oxidation, and holograms. Each stage refines the finish to higher clarity.',
    details: ['Compound cut (heavy defects)', 'Polish refine (clarity)', 'Jeweling finish (depth)', 'IPA panel wipe'],
    duration: '3-6 hours',
    icon: 'rotate-cw',
    image: '/images/editorial/polishing.jpg',
    imageAlt: 'Machine polishing a white car hood',
  },
  {
    number: '03',
    title: 'Ceramic Coating',
    description: 'Professional-grade SiO2 ceramic coating applied panel-by-panel in controlled environment. Creates hydrophobic, UV-resistant, chemical-resistant barrier.',
    details: ['Surface prep & inspection', 'Base layer application', 'Top coat (if applicable)', 'Cure time: 12-24 hours'],
    duration: '2-4 hours',
    icon: 'shield',
    image: '/images/editorial/beading.jpg',
    imageAlt: 'Water droplets on a red sports car body',
  },
  {
    number: '04',
    title: 'Final Details',
    description: 'Every surface perfected. Wheels coated, glass treated, trim restored, interior detailed. Vehicle delivered showroom-ready with care guide.',
    details: ['Wheel faces & barrels coated', 'Glass ceramic coating', 'Trim restoration', 'Interior deep clean', 'Final QC & walkthrough'],
    duration: '2-3 hours',
    icon: 'sparkles',
    image: '/images/editorial/wheels.jpg',
    imageAlt: 'Careful wheel cleaning and finishing',
  },
];

const ICONS = {
  droplets: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  ),
  'rotate-cw': (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  sparkles: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93l-14.14 14.14" />
    </svg>
  ),
};

export const ProcessSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="process" className="relative py-24 md:py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block px-4 py-1.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs tracking-widest uppercase rounded-full mb-6">
            Our Process
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6">
            Precision at<br />
            <span className="text-emerald-400">Every Stage</span>
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Four phases. Zero shortcuts. Every vehicle receives the same obsessive attention
            whether it&apos;s a daily driver or a concours competitor.
          </p>
        </div>

        {/* Process Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400/50 via-emerald-400/20 to-transparent -translate-x-1/2" />

          <div className="space-y-12 md:space-y-16">
            {PROCESS_STEPS.map((step, index) => (
              <ProcessStep
                key={step.number}
                step={step}
                index={index}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="lg:hidden mt-12 flex items-center justify-center gap-2">
          {PROCESS_STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeStep
                  ? 'bg-emerald-400 w-8'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface ProcessStepProps {
  step: (typeof PROCESS_STEPS)[0];
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const ProcessStep = ({ step, index, isActive, onClick }: ProcessStepProps) => {
  const isEven = index % 2 === 0;

  return (
    <article
      className={`relative group cursor-pointer transition-all duration-500 ${
        isActive ? 'scale-[1.02]' : ''
      }`}
      onClick={onClick}
    >
      <div className={`flex flex-col lg:flex-row ${isEven ? 'lg:flex-row-reverse' : ''} items-start gap-8 md:gap-12`}>
        {/* Content */}
        <div className={`flex-1 lg:w-1/2 relative z-10 ${isEven ? 'lg:pl-12' : 'lg:pr-12'} text-center lg:text-left`}>
          {/* Step Number */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
            <span
              className={`text-4xl md:text-5xl font-light tracking-tight transition-colors ${
                isActive ? 'text-emerald-400' : 'text-white/30'
              }`}
            >
              {step.number}
            </span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
          </div>

          {/* Icon */}
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 transition-all duration-500 ${
              isActive
                ? 'bg-emerald-400/20 text-emerald-400 scale-110'
                : 'bg-white/5 text-white/50'
            }`}
          >
            {ICONS[step.icon as keyof typeof ICONS]}
          </div>

          {/* Title & Description */}
          <h3 className={`text-2xl md:text-3xl font-light text-white tracking-tight mb-4 ${isActive ? 'text-emerald-400' : ''}`}>
            {step.title}
          </h3>
          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-6">{step.description}</p>

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {step.details.map((detail, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-sm text-white/60 transition-colors ${
                  isActive ? 'text-white/80' : ''
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/50" />
                {detail}
              </div>
            ))}
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{step.duration}</span>
          </div>
        </div>

        {/* Visual Card */}
        <div className={`w-full flex-1 lg:w-1/2 relative`}>
          <div
            className={`relative aspect-[4/3] rounded-2xl overflow-hidden transition-all duration-700 ${
              isActive
                ? 'ring-2 ring-emerald-400/50 shadow-[0_0_60px_rgba(0,212,170,0.15)]'
                : 'opacity-90 hover:opacity-100'
            }`}
          >
            <Image src={step.image} alt={step.imageAlt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
              <span className="text-xs uppercase tracking-[0.2em]">{step.title}</span>
              <span className="text-xs text-white/70">{step.duration}</span>
            </div>
          </div>

          {/* Stage indicator dot on timeline */}
          <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div
              className={`w-4 h-4 rounded-full border-4 transition-all duration-500 ${
                isActive
                  ? 'bg-emerald-400 border-white shadow-[0_0_20px_rgba(0,212,170,0.8)]'
                  : 'bg-black border-white/20'
              }`}
            />
          </div>
        </div>
      </div>
    </article>
  );
};