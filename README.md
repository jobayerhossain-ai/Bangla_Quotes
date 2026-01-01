# 🌟 Bangla Quotes Platform

> **Enterprise-grade full-stack web platform for Bangla quotes with advanced quote studio and professional admin panel**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The **Bangla Quotes Platform** is a comprehensive web application that allows users to browse, customize, and share Bangla quotes. It consists of three main components:

1. **Public Web App** - Browse and discover Bangla quotes
2. **Quote Studio** - Advanced canvas-based quote designer
3. **Admin Panel** - Professional content management system

This platform is designed to scale to millions of users with enterprise-grade architecture, security, and performance.

## ✨ Features

### Public Web App
- 📚 Browse thousands of Bangla quotes
- 🏷️ Category-wise organization
- 🔍 Advanced search and filtering
- ❤️ Favorites system
- 🌓 Dark/Light theme
- 📱 Fully responsive design
- ⚡ Lightning-fast performance
- 🔎 SEO optimized

### Quote Studio
- 🎨 Live canvas-based editor
- 🖋️ Font customization (size, family, color)
- 🌈 Background customization (color, gradient, image)
- 📐 Text alignment and spacing
- 💾 High-quality PNG export (2x resolution)
- 📤 Web Share API integration
- 🚀 Optimized for low-end devices
- 🎯 Pixel-perfect rendering

### Admin Panel
- 🔐 Secure authentication
- 📊 Comprehensive dashboard with statistics
- ✍️ Quote management (CRUD + bulk upload)
- 📂 Category management
- 🖼️ Asset management (backgrounds, gradients, fonts)
- 📈 Analytics and insights
- 👥 User management
- ⚙️ System settings

## 🏗️ Architecture

This project uses a **monorepo architecture** with the following structure:

```
bangla-quotes-platform/
├── apps/
│   ├── web/          # Public web app (Next.js)
│   ├── admin/        # Admin panel (Next.js)
│   └── api/          # Backend API (Express + Prisma)
├── packages/
│   └── shared-types/ # Shared TypeScript types
└── docs/             # Documentation
```

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + SWR
- **Canvas**: HTML5 Canvas API
- **Fonts**: Hind Siliguri (Bangla), Inter (English)

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Upload**: Multer + Sharp

### DevOps
- **Monorepo**: Turborepo
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions (optional)

## 📁 Project Structure

```
bangla-quotes-platform/
├── apps/
│   ├── web/                      # Public web app
│   │   ├── src/
│   │   │   ├── app/             # Next.js pages
│   │   │   ├── components/      # React components
│   │   │   ├── lib/             # Utilities
│   │   │   └── styles/          # Global styles
│   │   └── public/              # Static assets
│   │
│   ├── admin/                    # Admin panel
│   │   ├── src/
│   │   │   ├── app/             # Admin pages
│   │   │   ├── components/      # Admin components
│   │   │   └── lib/             # Admin utilities
│   │   └── public/
│   │
│   └── api/                      # Backend API
│       ├── src/
│       │   ├── routes/          # API routes
│       │   ├── controllers/     # Request handlers
│       │   ├── services/        # Business logic
│       │   ├── middleware/      # Express middleware
│       │   ├── validators/      # Input validation
│       │   └── utils/           # Helper functions
│       ├── prisma/              # Database schema
│       └── uploads/             # File uploads
│
├── packages/
│   └── shared-types/            # Shared TypeScript types
│       └── src/
│           └── index.ts         # Type definitions
│
├── ARCHITECTURE.md              # Architecture documentation
├── IMPLEMENTATION_PLAN.md       # Implementation guide
├── package.json                 # Root package.json
├── turbo.json                   # Turborepo config
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **npm**: >= 10.0.0
- **PostgreSQL**: >= 15.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/bangla-quotes-platform.git
   cd bangla-quotes-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in each app:
   
   **apps/api/.env**
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/bangla_quotes"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key"
   PORT=5000
   NODE_ENV=development
   ```
   
   **apps/web/.env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/v1
   ```
   
   **apps/admin/.env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/v1
   ```

4. **Set up the database**
   ```bash
   cd apps/api
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - **Web App**: http://localhost:3000
   - **Admin Panel**: http://localhost:3001
   - **API**: http://localhost:5000

## 💻 Development

### Available Scripts

From the root directory:

```bash
# Start all apps in development mode
npm run dev

# Build all apps
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Clean all build artifacts
npm run clean
```

### Working with Individual Apps

```bash
# Web app
cd apps/web
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Admin panel
cd apps/admin
npm run dev
npm run build
npm run start

# API
cd apps/api
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run start        # Start production server
npm run prisma:studio # Open Prisma Studio
```

### Database Management

```bash
cd apps/api

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Seed database
npx prisma db seed
```

### Adding New Dependencies

```bash
# Add to specific app
cd apps/web
npm install package-name

# Add to workspace root (dev dependencies)
npm install -D package-name -W

# Add to shared package
cd packages/shared-types
npm install package-name
```

## 🎨 Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety

Run before committing:
```bash
npm run lint
npm run format
npm run type-check
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Building for Production

```bash
# Build all apps
npm run build

# Build specific app
cd apps/web
npm run build
```

## 🚀 Deployment

### Backend (API)

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd apps/api
railway up
```

**Option 2: Render**
1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd apps/api && npm install && npm run build`
4. Set start command: `cd apps/api && npm start`
5. Add environment variables

### Frontend (Web & Admin)

**Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy web app
cd apps/web
vercel

# Deploy admin panel
cd apps/admin
vercel
```

### Database

**Recommended providers:**
- [Supabase](https://supabase.com/) - Free PostgreSQL with generous limits
- [Railway](https://railway.app/) - Easy PostgreSQL deployment
- [Neon](https://neon.tech/) - Serverless PostgreSQL

## 📚 Documentation

- [Architecture Documentation](ARCHITECTURE.md) - System design and architecture
- [Implementation Plan](IMPLEMENTATION_PLAN.md) - Step-by-step development guide
- [API Documentation](apps/api/docs/API.md) - API endpoints and usage (coming soon)
- [Admin Guide](docs/ADMIN_GUIDE.md) - Admin panel user guide (coming soon)
- [Studio Guide](docs/STUDIO_GUIDE.md) - Quote studio tutorial (coming soon)

## 🔒 Security

- **Authentication**: JWT-based with refresh tokens
- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Zod schemas for all inputs
- **SQL Injection**: Protected by Prisma ORM
- **XSS Prevention**: Content Security Policy + input sanitization
- **Rate Limiting**: 100 requests/15min per IP
- **CORS**: Configured for specific origins only

## 🎯 Performance

- **Lighthouse Score**: > 90 (all categories)
- **API Response Time**: < 200ms (p95)
- **Page Load Time**: < 2s (LCP)
- **Bundle Size**: Optimized with code splitting
- **Image Optimization**: Next.js Image component + WebP
- **Database**: Indexed queries + connection pooling

## 📊 Monitoring

- **Error Tracking**: Sentry (optional)
- **Analytics**: Vercel Analytics
- **Uptime**: UptimeRobot
- **Performance**: Vercel Speed Insights

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code passes all linting and type checks
- Tests are added for new features
- Documentation is updated

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Hind Siliguri](https://fonts.google.com/specimen/Hind+Siliguri) - Bangla font

## 📞 Support

For support, email support@banglaquotes.com or open an issue on GitHub.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core platform development
- ✅ Quote studio
- ✅ Admin panel
- ✅ Basic analytics

### Phase 2 (Next)
- [ ] User authentication for favorites sync
- [ ] Social sharing integration
- [ ] Advanced analytics dashboard
- [ ] Mobile apps (React Native)

### Phase 3 (Future)
- [ ] AI-powered quote recommendations
- [ ] Community contributions
- [ ] Premium features
- [ ] API for third-party developers

---

**Built with ❤️ for the Bangla-speaking community**
