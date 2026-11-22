# Prime Detail - Premium Automotive Detailing Website

Award-winning Three.js/WebGL experience inspired by adidas CHILE20, adapted for a premium car detailing salon. Features horizontal scroll storytelling, real-time shader effects, and immersive 3D vehicle showcase.

## ✨ Features

- **Three.js/WebGL Experience** - Three immersive "worlds" (Dirty → Correction → Perfect) with scroll-driven transitions
- **Custom Shader Effects** - Real-time dirt, water/soap, polish, and ceramic coating shaders
- **Horizontal Scroll Navigation** - GSAP ScrollTrigger + Lenis smooth scrolling
- **Procedural 3D Car Models** - Optimized geometry with dynamic material transitions
- **Particle Systems** - Stage-specific particles (dust, water droplets, sparkles)
- **Service Tiers** - Three detailing packages with feature comparison
- **Booking System** - Full appointment booking with validation
- **Before/After Gallery** - Interactive comparison slider
- **Process Timeline** - Four-stage detailing process showcase
- **Performance Optimized** - LOD, texture compression, lazy loading

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D**: Three.js, React Three Fiber, React Three Drei
- **Animation**: GSAP, ScrollTrigger, Lenis
- **State**: Zustand
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions

## 📦 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/prime-detail.git
cd prime-detail

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SITE_URL` | Production site URL | Yes |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |
| `BOOKING_API_ENDPOINT` | Booking API endpoint | Yes |
| `EMAIL_SERVICE_KEY` | Email service API key | Yes |

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main page with horizontal scroll
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles
│   └── sitemap.ts         # Dynamic sitemap generation
├── components/
│   ├── three/             # Three.js components
│   │   ├── DetailingScene.tsx    # Main 3D scene with shaders
│   │   └── HorizontalScroll.tsx  # GSAP horizontal scroll
│   ├── ui/                # Reusable UI components
│   │   ├── Navigation.tsx
│   │   ├── ServiceTiers.tsx
│   │   ├── BookingForm.tsx
│   │   └── Footer.tsx
│   └── sections/          # Page sections
│       ├── ProcessSection.tsx
│       └── GallerySection.tsx
├── lib/
│   └── shaders/           # GLSL shaders
│       └── detailingShaders.ts
├── types/
│   └── index.ts           # TypeScript definitions
└── styles/                # Additional styles
```

## 🎨 Three.js Scene Architecture

### Three Worlds (Stages)

1. **Dirty/Neglected** - Dirt, dust, oxidation, water spots
2. **Correction Process** - Water, soap, machine polishing
3. **Perfect/After** - Ceramic coating, hydrophobic, mirror finish

### Shader Pipeline

- **Vertex Shader**: Normal/UV passing, world/view positions
- **Fragment Shader**: 
  - FBM noise for organic patterns
  - Dirt/dust accumulation
  - Water/soap bubble simulation
  - Polish fresnel & specular highlights
  - Ceramic hydrophobic beading effect
  - Metallic flake distribution

### Performance Optimizations

- Procedural geometry (no heavy GLTF loads)
- Shader-based material transitions (no texture swapping)
- Particle systems with GPU instancing
- LOD via distance-based detail reduction
- `requestAnimationFrame` sync with Lenis

## 📱 Responsive Breakpoints

| Device | Width | Scroll Mode |
|--------|-------|-------------|
| Mobile | < 768px | Vertical (sections stack) |
| Tablet | 768-1024px | Horizontal + vertical hybrid |
| Desktop | > 1024px | Full horizontal experience |

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # TypeScript type checking
npm run format       # Format with Prettier
npm run analyze      # Bundle analysis
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Build

```bash
npm run build
npm run start
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 📊 Performance Targets

- **Lighthouse Performance**: ≥ 90
- **Lighthouse Accessibility**: ≥ 95
- **Lighthouse Best Practices**: ≥ 90
- **Lighthouse SEO**: ≥ 90
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Total Blocking Time**: < 200ms
- **Cumulative Layout Shift**: < 0.1

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Reduced motion support
- Color contrast compliance
- Screen reader compatible

## 🔒 Security Headers

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Email**: hello@primedetail.com
- **Phone**: (214) 555-0199
- **Address**: 1847 Industrial Blvd, Suite 100, Dallas, TX 75207

---

Built with ❤️ by the Prime Detail team. Inspired by [adidas CHILE20](https://www.awwwards.com/sites/chile20) by Active Theory.