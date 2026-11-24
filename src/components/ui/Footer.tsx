'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  services: [
    { label: 'Essential Detail', href: '#services' },
    { label: 'Paint Correction', href: '#services' },
    { label: 'Ceramic Coating', href: '#services' },
    { label: 'PPF Installation', href: '#services' },
    { label: 'Maintenance Plans', href: '#services' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Process', href: '#process' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'Careers', href: '#careers' },
  ],
  support: [
    { label: 'FAQ', href: '#faq' },
    { label: 'Booking Policy', href: '#policy' },
    { label: 'Warranty Info', href: '#warranty' },
    { label: 'Care Guides', href: '#guides' },
    { label: 'Contact', href: '#contact' },
  ],
};

const SOCIAL_LINKS = [
  { name: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { name: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  { name: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { name: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
];

const ICONS = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.44 24.12 24.12 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.44 24.12 24.12 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 8v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" />
      <path d="M17 8v7a2 2 0 0 1-4 0M9 12v2" />
    </svg>
  ),
};

export const Footer = () => {
  return (
    <footer id="contact" className="relative material-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="#hero" className="flex items-center gap-3 text-white font-light tracking-widest text-xl mb-6" aria-label="Prime Detail - Home">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#00D4AA" />
                    <stop offset="100%" stopColor="#0066FF" />
                  </linearGradient>
                </defs>
                <path d="M16 2 L28 10 V22 L16 30 L4 22 V10 Z" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinejoin="round" />
                <path d="M16 8 L16 24 M8 16 L24 16" stroke="url(#footerLogoGradient)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="16" r="4" fill="url(#footerLogoGradient)" />
              </svg>
              <span>Prime Detail</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Premium automotive detailing since 2009. Obsessive craftsmanship. Lasting protection.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-emerald-400 hover:bg-white/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {ICONS[social.icon as keyof typeof ICONS]}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <nav>
            <h4 className="text-white font-light tracking-wide text-sm uppercase mb-4">Services</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/50 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav>
            <h4 className="text-white font-light tracking-wide text-sm uppercase mb-4">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/50 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support */}
          <nav>
            <h4 className="text-white font-light tracking-wide text-sm uppercase mb-4">Support</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-white/50 hover:text-emerald-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 pt-8 border-t border-white/10">
          <div>
            <h4 className="text-white font-light tracking-wide text-sm uppercase mb-4">Visit Us</h4>
            <address className="text-white/50 text-sm leading-relaxed not-italic space-y-2">
              <p>1847 Industrial Boulevard</p>
              <p>Suite 100, Dallas, TX 75207</p>
              <p className="mt-4">
                <a href="tel:+12145550199" className="hover:text-emerald-400 transition-colors">(214) 555-0199</a>
              </p>
              <p>
                <a href="mailto:hello@primedetail.com" className="hover:text-emerald-400 transition-colors">hello@primedetail.com</a>
              </p>
            </address>
          </div>

          <div>
            <h4 className="text-white font-light tracking-wide text-sm uppercase mb-4">Hours</h4>
            <div className="text-white/50 text-sm leading-relaxed space-y-2">
              <p><span className="text-white/70">Mon - Fri:</span> 8:00 AM - 6:00 PM</p>
              <p><span className="text-white/70">Saturday:</span> 9:00 AM - 4:00 PM</p>
              <p><span className="text-white/70">Sunday:</span> Closed</p>
              <p className="mt-4 text-white/40">By appointment only</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-light tracking-wide text-sm uppercase mb-4">Newsletter</h4>
            <p className="text-white/50 text-sm leading-relaxed mb-4">Care tips, new services, exclusive offers.</p>
            <form className="flex gap-2" action="#" method="POST">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                required
              />
              <button type="submit" className="px-6 py-2.5 bg-emerald-400 text-black font-medium text-sm rounded-lg hover:bg-emerald-300 transition-all">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Prime Detail. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <Link href="#privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="#cookies" className="hover:text-white/60 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};