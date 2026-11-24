import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AnimatedCursor from '@/components/ui/AnimatedCursor';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Prime Detail | Premium Automotive Detailing & Ceramic Coating',
    template: '%s | Prime Detail',
  },
  description: 'Premium automotive detailing since 2009. Paint correction, ceramic coating, PPF installation. Obsessive craftsmanship. Lasting protection. Dallas, TX.',
  keywords: ['auto detailing', 'ceramic coating', 'paint correction', 'PPF', 'car detailing Dallas', 'vehicle protection'],
  authors: [{ name: 'Prime Detail' }],
  creator: 'Prime Detail',
  publisher: 'Prime Detail',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://primedetail.com',
    siteName: 'Prime Detail',
    title: 'Prime Detail | Premium Automotive Detailing & Ceramic Coating',
    description: 'Premium automotive detailing since 2009. Paint correction, ceramic coating, PPF installation. Obsessive craftsmanship. Lasting protection.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prime Detail - Premium Automotive Detailing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prime Detail | Premium Automotive Detailing',
    description: 'Premium automotive detailing since 2009. Paint correction, ceramic coating, PPF installation.',
    images: ['/og-image.jpg'],
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="material-background text-white min-h-screen">
        {children}
        <AnimatedCursor />
      </body>
    </html>
  );
}
