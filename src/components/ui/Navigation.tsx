'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '#hero', label: 'Home' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#booking', label: 'Book Now' },
  { href: '#contact', label: 'Contact' },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="#hero"
          className="flex items-center gap-3 text-white font-light tracking-widest text-xl"
          aria-label="Prime Detail - Home"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-400"
          >
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#00D4AA" />
                <stop offset="100%" stopColor="#0066FF" />
              </linearGradient>
            </defs>
            <path
              d="M16 2 L28 10 V22 L16 30 L4 22 V10 Z"
              stroke="url(#logoGradient)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M16 8 L16 24 M8 16 L24 16"
              stroke="url(#logoGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="16" cy="16" r="4" fill="url(#logoGradient)" />
          </svg>
          <span>Prime Detail</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-white font-light tracking-wide text-sm transition-colors duration-200 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-emerald-400 after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            href="#booking"
            className="px-6 py-2.5 bg-emerald-400 text-black font-medium text-sm tracking-wide rounded-full hover:bg-emerald-300 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-400/25"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-white hover:text-emerald-400 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 animate-slideDown"
          style={{ animation: 'slideDown 0.3s ease-out' }}
        >
          <div className="px-6 py-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block text-white/70 hover:text-emerald-400 font-light tracking-wide text-lg py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#booking"
              className="block w-full text-center px-6 py-3 mt-4 bg-emerald-400 text-black font-medium tracking-wide rounded-full hover:bg-emerald-300 transition-all"
            >
              Book Appointment
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
};