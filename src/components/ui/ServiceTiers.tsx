'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ServiceTier } from '@/types';

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'essential',
    name: 'Essential Detail',
    description: 'Perfect for regular maintenance. Restores shine and protects your investment.',
    price: '$299',
    duration: '3-4 hours',
    features: [
      'Exterior hand wash & dry',
      'Paint decontamination (clay bar)',
      'Single-stage machine polish',
      'Sealant protection (6 months)',
      'Wheel & tire detailing',
      'Window cleaning (in & out)',
      'Interior vacuum & wipe down',
      'Leather/vinyl conditioning',
    ],
    icon: 'sparkles',
    popular: false,
  },
  {
    id: 'correction',
    name: 'Paint Correction',
    description: 'Our signature service. Removes swirls, scratches, oxidation for mirror finish.',
    price: '$699',
    duration: '6-8 hours',
    features: [
      'Everything in Essential',
      'Two-stage machine correction',
      'Heavy defect removal',
      'Ceramic coating (2 years)',
      'Engine bay detailing',
      'Headlight restoration',
      'Trim restoration',
      'Fabric protection (Scotchgard)',
    ],
    icon: 'gem',
    popular: true,
  },
  {
    id: 'ceramic',
    name: 'Ceramic Pro Plus',
    description: 'Ultimate protection. Hydrophobic, UV-resistant, self-cleaning for 5+ years.',
    price: '$1,499',
    duration: '1-2 days',
    features: [
      'Everything in Paint Correction',
      'Multi-layer ceramic coating (5+ yrs)',
      'Paint protection film (PPF) prep',
      'Glass ceramic coating (all windows)',
      'Wheel ceramic coating (faces & barrels)',
      'Leather ceramic coating',
      'Annual maintenance included',
      'Lifetime warranty on coating',
    ],
    icon: 'shield',
    popular: false,
  },
];

const ICONS = {
  sparkles: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-400">
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93l-14.14 14.14" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  gem: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
      <path d="M6 3h12l4 4v12l-8 4-8-4V7l4-4z" />
      <path d="M6 7l8 4 8-4" />
      <path d="M12 11v8" />
    </svg>
  ),
  shield: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M12 11v8" />
      <path d="M9 14h6" />
    </svg>
  ),
};

export const ServiceTiers = () => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  return (
    <section id="services" className="relative py-24 md:py-32 px-6 material-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="inline-block px-4 py-1.5 bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs tracking-widest uppercase rounded-full mb-6">
            Our Services
          </span>
          <h2 className="text-4xl md:text-6xl font-light text-white tracking-tight leading-tight mb-6">
            Tailored Detailing<br />
            <span className="text-emerald-400">For Every Need</span>
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From maintenance washes to show-car perfection. Every service uses premium products
            and expert technique developed over 15+ years.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {SERVICE_TIERS.map((tier) => (
            <ServiceTierCard
              key={tier.id}
              tier={tier}
              isSelected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
            />
          ))}
        </div>

        {/* Comparison Link */}
        <div className="text-center mt-16">
          <button
            className="inline-flex items-center gap-2 text-white/60 hover:text-white font-light tracking-wide text-sm transition-colors"
          >
            Compare all packages in detail
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

interface ServiceTierCardProps {
  tier: ServiceTier;
  isSelected: boolean;
  onSelect: () => void;
}

const ServiceTierCard = ({ tier, isSelected, onSelect }: ServiceTierCardProps) => {
  return (
    <article
      className={`relative group rounded-2xl p-8 md:p-10 transition-all duration-500 ${
        isSelected
          ? 'bg-white/5 border-2 border-emerald-400 shadow-[0_0_60px_rgba(0,212,170,0.15)]'
          : 'bg-white/3 border border-white/10 hover:border-emerald-400/50 hover:bg-white/5'
      }`}
      onClick={onSelect}
    >
      <div className="relative -mx-8 -mt-8 mb-8 h-48 overflow-hidden rounded-t-2xl md:-mx-10 md:-mt-10">
        <Image src={`/images/editorial/${tier.id === 'essential' ? 'wash' : tier.id === 'correction' ? 'polishing' : 'beading'}.jpg`} alt={tier.id === 'essential' ? 'Foam wash on a sports car' : tier.id === 'correction' ? 'Machine polishing car paintwork' : 'Water droplets on protected paintwork'} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 bg-emerald-400 text-black text-xs font-medium tracking-widest uppercase rounded-full shadow-lg shadow-emerald-400/50">
            Most Popular
          </span>
        </div>
      )}

      {/* Icon */}
      <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
        {ICONS[tier.icon as keyof typeof ICONS] || ICONS.sparkles}
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-2xl font-light text-white tracking-tight mb-3">{tier.name}</h3>
        <p className="text-white/50 text-base leading-relaxed">{tier.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8 pb-8 border-b border-white/10">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl md:text-5xl font-light text-white">{tier.price}</span>
          <span className="text-white/40 font-light">starting</span>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{tier.duration}</span>
        </div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-emerald-400 flex-shrink-0 mt-0.5"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
          document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className={`w-full py-3.5 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
          isSelected
            ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-lg shadow-emerald-400/25'
            : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-emerald-400/50'
        }`}
      >
        {isSelected ? 'Selected - Book Now' : 'Select Package'}
      </button>
    </article>
  );
};