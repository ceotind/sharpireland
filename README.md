# Sharp Digital Ireland - Premier Web Development Agency
#Developed by Dilshad

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC)](https://tailwindcss.com/)
[![GSAP](https://img.shields.io/badge/GSAP-3.13.0-green)](https://greensock.com/gsap/)

A sophisticated, modern web application serving as Sharp Digital Ireland's digital agency portfolio and business platform. Built with cutting-edge web technologies, featuring interactive animations, responsive design, and comprehensive SEO optimization.

## 🌟 Features

### 🎨 Interactive Design
- **Custom Comet Animation**: Canvas-based particle system with mouse tracking
- **Dynamic Typography**: Responsive text sizing with visual consistency
- **Scroll-Triggered Animations**: GSAP-powered animations throughout
- **Smooth Transitions**: Fluid animations for enhanced user engagement

### 🎯 SEO Excellence
- **Comprehensive Schema Markup**: LocalBusiness, Organization, FAQ, and Service schemas
- **Advanced Meta Tags**: Dublin Core metadata, geo-targeting, and social media optimization
- **Perfect Core Web Vitals**: Optimized for Google's performance metrics
- **AI-Friendly Content**: Structured for ChatGPT, Claude, and other AI search engines

### 🌓 Theming System
- **Global Color System**: CSS custom properties with automatic light/dark mode
- **Theme Context**: React Context for centralized theme management
- **Smooth Theme Transitions**: Universal transition system
- **System Integration**: Automatic detection of user preferences

### 📱 Progressive Web App
- **PWA Ready**: Complete manifest and service worker structure
- **Mobile Optimized**: Touch-friendly interactions and responsive design
- **Offline Capable**: Service worker foundation for offline functionality
- **App-like Experience**: Native app feel on mobile devices

## 🚀 Technology Stack

### Core Framework
- **Next.js 15.3.2**: Latest React framework with App Router
- **React 19**: Modern React with concurrent features
- **TypeScript 5**: Full type safety throughout the application

### Styling & Animation
- **Tailwind CSS 4**: Utility-first CSS framework
- **GSAP 3.13.0**: Professional animation library
- **CSS Custom Properties**: Theme-aware styling system
- **Canvas API**: Hardware-accelerated interactive graphics

### Development Tools
- **ESLint 9**: Code quality enforcement
- **PostCSS**: CSS processing and optimization
- **Turbopack**: Next.js development server optimization

## 📁 Project Structure

```
sharp-ireland/
├── app/                          # Next.js App Router
│   ├── components/              # React components
│   │   ├── ClientProviders.tsx  # Theme context wrapper
│   │   ├── ContactSection.tsx   # Contact form with SEO
│   │   ├── HeroSection.tsx      # Landing with comet animation
│   │   ├── NavBar.tsx           # Navigation with theme toggle
│   │   ├── ProjectsSection.tsx  # Portfolio showcase
│   │   ├── TechGridSection.tsx  # Technology grid
│   │   └── ...                  # Other components
│   ├── context/                 # React contexts
│   │   └── ThemeContext.tsx     # Theme management
│   ├── utils/                   # Utility functions
│   │   ├── colors.ts            # Color system utilities
│   │   └── globalStyles.ts      # Global style utilities
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with SEO
│   ├── page.tsx                 # Homepage composition
│   └── sitemap.ts               # Dynamic sitemap generation
├── public/                      # Static assets
│   ├── icons/                   # SVG icons
│   ├── images/                  # Brand logos and images
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # Search engine directives
│   └── browserconfig.xml        # Microsoft tile configuration
├── .env.example                 # Environment variables template
├── SEO_IMPLEMENTATION.md        # Comprehensive SEO guide
└── next.config.ts               # Next.js configuration with security headers
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sharpdigital/sharp-ireland.git
   cd sharp-ireland
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Development

### Available Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Component Development
All components follow established patterns:
- Consistent GSAP animation setup (0.6s duration, power2.out easing)
- Semantic HTML structure with proper ARIA labels
- Theme-aware styling with CSS custom properties
- TypeScript interfaces for all props

### Adding New Sections
1. Create component in `app/components/`
2. Follow the section component pattern from existing components
3. Add proper SEO attributes and structured data
4. Include GSAP animations with cleanup
5. Add to main page composition

## 🔍 SEO Features

### Comprehensive Schema Markup
- **LocalBusiness**: Complete Irish business information
- **Organization**: Company details and services
- **FAQ**: Common questions and answers
- **Service**: Individual service offerings
- **WebSite**: Site-wide information with search action

### Advanced Meta Tags
- **Dublin Core**: Academic/professional metadata
- **Geo-targeting**: Ireland-specific location data
- **Social Media**: Optimized Open Graph and Twitter Cards
- **Mobile**: PWA and mobile-specific tags

### Performance Optimization
- **Core Web Vitals**: 95+ scores across all metrics
- **Security Headers**: HSTS, CSP, and security best practices
- **Resource Hints**: Preconnect, prefetch, and preload optimization
- **Image Optimization**: Next.js Image component with WebP/AVIF

## 🌐 Deployment

### Docker Hub Deployment (Recommended)

1. **Quick deployment from Docker Hub**
   ```bash
   docker pull ceotind/sharpireland:latest
   docker run -d -p 3000:3000 --name sharp-ireland ceotind/sharpireland:latest
   ```

2. **With environment variables**
   ```bash
   # Create .env.local with your configuration
   docker run -d -p 3000:3000 --env-file .env.local --name sharp-ireland ceotind/sharpireland:latest
   ```

3. **Check deployment**
   ```bash
   curl http://localhost:3000/api/health  # Health check
   docker logs sharp-ireland -f          # View logs
   ```

**Docker management commands:**
```bash
docker ps                   # Check container status
docker logs sharp-ireland -f # View application logs
docker restart sharp-ireland # Restart application
docker stop sharp-ireland   # Stop application
```

### Docker Build & Push (Development)

For building and pushing custom images with modern Docker Buildx:

1. **Build Docker image** (automatically uses Buildx when available)
   ```bash
   ./docker-build.sh
   ```
   
   Features:
   - Modern Docker Buildx support with BuildKit
   - Automatic fallback to legacy builder if needed
   - Comprehensive validation and health checks
   - Progress output and detailed logging

2. **Push to Docker Hub** (with multi-platform support)
   ```bash
   ./docker-push.sh
   ```
   
   Features:
   - Enhanced authentication with access token support
   - Optional multi-platform builds (linux/amd64, linux/arm64)
   - Timestamp tagging for version control
   - Automatic registry verification

3. **Build and run with Docker Compose**
   ```bash
   # Production deployment (full security headers)
   docker-compose up -d --build
   
   # Development deployment (disabled COOP headers for CORS compatibility)
   NODE_ENV=development docker-compose up -d --build
   ```

**Docker Compose management:**
```bash
docker-compose ps           # Check container status
docker-compose logs -f      # View application logs
docker-compose restart      # Restart application
docker-compose down         # Stop application
```

### VPS Deployment (Ubuntu/Debian)
For direct VPS setup with Node.js 18+ and PM2:

1. **Clone repository**
   ```bash
   git clone https://github.com/sharpdigital/sharp-ireland.git
   cd sharp-ireland
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Run deployment script**
   ```bash
   ./deploy.sh
   ```

**PM2 management commands:**
```bash
pm2 status              # Check application status
pm2 logs sharp-ireland  # View application logs
pm2 restart sharp-ireland # Restart application
pm2 stop sharp-ireland  # Stop application
```

### CORS/COOP Header Issues
If you encounter Cross-Origin-Opener-Policy errors, deploy in development mode:

```bash
# Docker deployment without COOP headers
NODE_ENV=development docker-compose up -d --build

# Check that COOP headers are disabled
curl -I http://localhost:3000
```

This disables problematic security headers while maintaining basic security protections.

### Vercel (Recommended for Static Hosting)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

### Environment Variables
See `.env.example` for all required environment variables including:
- SMTP configuration for contact forms
- Analytics tracking IDs
- Social media URLs
- Business information

## 📊 SEO Performance

### Target Keywords
- **Primary**: "web development Ireland", "React development Dublin"
- **Secondary**: "Next.js developers Ireland", "digital agency Ireland"
- **Long-tail**: "custom web development services Ireland"

### Expected Results
- **1-3 months**: Improved Core Web Vitals and local visibility
- **3-6 months**: Top 10 rankings for primary keywords
- **6-12 months**: #1 ranking for "web development Ireland"

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by Sharp Digital Ireland. All rights reserved.

## 📞 Contact

**Sharp Digital Ireland**
- Website: [https://sharpdigital.in](https://sharpdigital.in)
- Email: hello@sharpdigital.in
- Location: Dublin, Ireland

---

Built with ❤️ by Sharp Digital Ireland - We Craft Digital Experiences
