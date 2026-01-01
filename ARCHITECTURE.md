# 🏛️ Bangla Quotes Platform - Enterprise Architecture

## System Overview

A full-featured Bangla Quotes Web Platform consisting of:
1. **Public User Web App** - Browse and customize quotes
2. **Web Quote Studio** - Advanced canvas-based quote designer
3. **Professional Admin Panel** - Complete content management system
4. **Unified Backend API** - RESTful API with PostgreSQL
5. **Single Shared Database** - Single source of truth

---

## 📊 Technology Stack

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Fonts**: Hind Siliguri (Bangla), Inter (English)
- **State Management**: React Context + SWR for data fetching
- **Canvas Engine**: HTML5 Canvas API + html2canvas
- **Image Processing**: Sharp (server-side), Canvas API (client-side)

### Backend Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Validation**: Zod
- **File Upload**: Multer + Sharp
- **Rate Limiting**: express-rate-limit
- **Security**: helmet, cors, express-validator

### DevOps & Tools
- **Package Manager**: npm
- **Build Tool**: Turbo (monorepo)
- **Linting**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **API Documentation**: Swagger/OpenAPI
- **Environment**: dotenv

---

## 🗂️ Project Structure

```
bangla-quotes-platform/
├── apps/
│   ├── web/                    # Public user web app
│   │   ├── src/
│   │   │   ├── app/           # Next.js App Router
│   │   │   │   ├── (public)/
│   │   │   │   │   ├── page.tsx              # Home
│   │   │   │   │   ├── categories/           # Categories listing
│   │   │   │   │   ├── category/[slug]/      # Category quotes
│   │   │   │   │   ├── quote/[id]/           # Quote detail
│   │   │   │   │   ├── studio/[id]/          # Quote studio
│   │   │   │   │   ├── favorites/            # User favorites
│   │   │   │   │   ├── about/
│   │   │   │   │   ├── privacy/
│   │   │   │   │   └── contact/
│   │   │   │   ├── api/                      # API routes (proxy to backend)
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── ui/                       # Reusable UI components
│   │   │   │   ├── quote/                    # Quote-specific components
│   │   │   │   ├── studio/                   # Studio components
│   │   │   │   └── layout/                   # Layout components
│   │   │   ├── lib/
│   │   │   │   ├── api.ts                    # API client
│   │   │   │   ├── constants.ts
│   │   │   │   └── utils.ts
│   │   │   ├── hooks/                        # Custom React hooks
│   │   │   ├── contexts/                     # React contexts
│   │   │   ├── types/                        # TypeScript types
│   │   │   └── styles/
│   │   │       └── globals.css
│   │   ├── public/
│   │   │   ├── fonts/
│   │   │   └── images/
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── admin/                  # Admin panel
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/
│   │   │   │   │   └── login/
│   │   │   │   ├── (dashboard)/
│   │   │   │   │   ├── page.tsx              # Dashboard
│   │   │   │   │   ├── quotes/               # Quote management
│   │   │   │   │   ├── categories/           # Category management
│   │   │   │   │   ├── assets/               # Asset management
│   │   │   │   │   └── settings/
│   │   │   │   └── layout.tsx
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── forms/
│   │   │   │   └── tables/
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── api/                    # Backend API
│       ├── src/
│       │   ├── index.ts                      # Entry point
│       │   ├── app.ts                        # Express app setup
│       │   ├── routes/
│       │   │   ├── index.ts
│       │   │   ├── quotes.routes.ts
│       │   │   ├── categories.routes.ts
│       │   │   ├── assets.routes.ts
│       │   │   ├── auth.routes.ts
│       │   │   └── stats.routes.ts
│       │   ├── controllers/
│       │   │   ├── quotes.controller.ts
│       │   │   ├── categories.controller.ts
│       │   │   ├── assets.controller.ts
│       │   │   ├── auth.controller.ts
│       │   │   └── stats.controller.ts
│       │   ├── services/
│       │   │   ├── quotes.service.ts
│       │   │   ├── categories.service.ts
│       │   │   ├── assets.service.ts
│       │   │   └── auth.service.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── validation.middleware.ts
│       │   │   ├── error.middleware.ts
│       │   │   └── rateLimit.middleware.ts
│       │   ├── validators/
│       │   │   ├── quote.validator.ts
│       │   │   ├── category.validator.ts
│       │   │   └── auth.validator.ts
│       │   ├── utils/
│       │   │   ├── logger.ts
│       │   │   ├── response.ts
│       │   │   └── upload.ts
│       │   └── config/
│       │       ├── database.ts
│       │       └── env.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       ├── uploads/                          # File uploads directory
│       ├── tsconfig.json
│       └── package.json
│
├── packages/
│   ├── shared-types/           # Shared TypeScript types
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── quote.types.ts
│   │   │   ├── category.types.ts
│   │   │   ├── asset.types.ts
│   │   │   └── api.types.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ui-components/          # Shared UI components (optional)
│       ├── src/
│       ├── tsconfig.json
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── package.json                # Root package.json (workspace)
├── turbo.json                  # Turborepo config
├── README.md
└── ARCHITECTURE.md             # This file
```

---

## 🗄️ Database Schema (PostgreSQL + Prisma)

### Core Models

#### 1. User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  password      String
  name          String
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  favorites     Favorite[]
  
  @@index([email])
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}
```

#### 2. Category
```prisma
model Category {
  id            String    @id @default(cuid())
  nameBn        String
  nameEn        String
  slug          String    @unique
  description   String?
  isActive      Boolean   @default(true)
  order         Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  quotes        Quote[]
  
  @@index([slug])
  @@index([isActive])
}
```

#### 3. Quote
```prisma
model Quote {
  id            String    @id @default(cuid())
  textBn        String    @db.Text
  textEn        String?   @db.Text
  author        String?
  categoryId    String
  status        QuoteStatus @default(DRAFT)
  views         Int       @default(0)
  shares        Int       @default(0)
  downloads     Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  publishedAt   DateTime?
  
  category      Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  favorites     Favorite[]
  
  @@index([categoryId])
  @@index([status])
  @@index([createdAt])
}

enum QuoteStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

#### 4. StudioAsset
```prisma
model StudioAsset {
  id            String    @id @default(cuid())
  type          AssetType
  name          String
  value         String    @db.Text  // URL for images, hex/gradient for colors, font name for fonts
  preview       String?   // Preview URL for images
  isPremium     Boolean   @default(false)
  isActive      Boolean   @default(true)
  order         Int       @default(0)
  metadata      Json?     // Additional metadata (dimensions, file size, etc.)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  @@index([type])
  @@index([isActive])
}

enum AssetType {
  BACKGROUND_IMAGE
  BACKGROUND_GRADIENT
  FONT
  TEXTURE
}
```

#### 5. Favorite
```prisma
model Favorite {
  id            String    @id @default(cuid())
  userId        String
  quoteId       String
  createdAt     DateTime  @default(now())
  
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  quote         Quote     @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  
  @@unique([userId, quoteId])
  @@index([userId])
  @@index([quoteId])
}
```

#### 6. Analytics (Optional - for tracking)
```prisma
model Analytics {
  id            String    @id @default(cuid())
  quoteId       String?
  event         AnalyticsEvent
  metadata      Json?
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime  @default(now())
  
  @@index([quoteId])
  @@index([event])
  @@index([createdAt])
}

enum AnalyticsEvent {
  QUOTE_VIEW
  QUOTE_SHARE
  QUOTE_DOWNLOAD
  STUDIO_OPEN
  CATEGORY_VIEW
}
```

---

## 🔌 API Architecture

### Base URL Structure
```
Production:  https://api.banglaquotes.com/v1
Development: http://localhost:5000/v1
```

### Authentication
- **Type**: JWT (JSON Web Tokens)
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 7 days (configurable)
- **Refresh Token**: Implemented for long-term sessions

### API Endpoints

#### Authentication (`/auth`)
```
POST   /auth/login              # Admin login
POST   /auth/register           # User registration (optional)
POST   /auth/refresh            # Refresh access token
POST   /auth/logout             # Logout
GET    /auth/me                 # Get current user
```

#### Quotes (`/quotes`)
```
GET    /quotes                  # List quotes (paginated, filtered)
GET    /quotes/:id              # Get single quote
POST   /quotes                  # Create quote (admin)
PUT    /quotes/:id              # Update quote (admin)
DELETE /quotes/:id              # Delete quote (admin)
POST   /quotes/bulk             # Bulk upload (admin)
GET    /quotes/random           # Get random quote
GET    /quotes/trending         # Get trending quotes
POST   /quotes/:id/view         # Increment view count
POST   /quotes/:id/share        # Increment share count
POST   /quotes/:id/download     # Increment download count
```

#### Categories (`/categories`)
```
GET    /categories              # List all categories
GET    /categories/:slug        # Get category by slug
POST   /categories              # Create category (admin)
PUT    /categories/:id          # Update category (admin)
DELETE /categories/:id          # Delete category (admin)
GET    /categories/:slug/quotes # Get quotes by category
```

#### Assets (`/assets`)
```
GET    /assets                  # List all assets (filtered by type)
GET    /assets/:id              # Get single asset
POST   /assets                  # Upload asset (admin)
PUT    /assets/:id              # Update asset (admin)
DELETE /assets/:id              # Delete asset (admin)
GET    /assets/backgrounds      # Get background images
GET    /assets/gradients        # Get gradients
GET    /assets/fonts            # Get fonts
```

#### Favorites (`/favorites`)
```
GET    /favorites               # Get user favorites
POST   /favorites               # Add to favorites
DELETE /favorites/:id           # Remove from favorites
```

#### Stats (`/stats`) - Admin only
```
GET    /stats/dashboard         # Dashboard statistics
GET    /stats/quotes            # Quote statistics
GET    /stats/categories        # Category statistics
GET    /stats/analytics         # Analytics data
```

### Response Format

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-12-31T10:34:43Z"
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "textBn",
        "message": "Bangla text is required"
      }
    ]
  },
  "timestamp": "2025-12-31T10:34:43Z"
}
```

#### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2025-12-31T10:34:43Z"
}
```

---

## 🎨 Quote Studio Architecture

### Canvas Rendering Engine

#### Core Features
1. **Real-time Preview**: Instant visual feedback
2. **High-Quality Export**: PNG export at 2x resolution
3. **Performance Optimized**: Debounced rendering, RAF-based updates
4. **Memory Safe**: Proper cleanup, no leaks

#### Studio Configuration Object
```typescript
interface StudioConfig {
  canvas: {
    width: number;           // Default: 1080px
    height: number;          // Default: 1080px
    exportScale: number;     // Default: 2 (for high-quality export)
  };
  text: {
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
    lineHeight: number;
    maxWidth: number;
  };
  background: {
    type: 'color' | 'gradient' | 'image';
    value: string | GradientConfig | string; // hex, gradient object, or image URL
  };
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface GradientConfig {
  type: 'linear' | 'radial';
  colors: string[];
  angle?: number;           // For linear gradients
  positions?: number[];     // Color stop positions
}
```

#### Rendering Pipeline
```
User Input → State Update → Debounce (150ms) → Canvas Render → Display
                                                      ↓
                                              (On Export)
                                                      ↓
                                          High-Res Canvas → PNG Blob → Download
```

#### Performance Optimizations
- **Debounced Rendering**: Prevent excessive re-renders
- **RequestAnimationFrame**: Smooth 60fps updates
- **Web Workers**: Offload heavy processing (if needed)
- **Image Caching**: Cache loaded background images
- **Lazy Loading**: Load assets on-demand

---

## 🔒 Security Measures

### Input Validation
- **Zod Schemas**: Type-safe validation for all inputs
- **Sanitization**: HTML/SQL injection prevention
- **File Upload**: MIME type validation, size limits, virus scanning

### Authentication & Authorization
- **Password Hashing**: bcrypt with salt rounds = 12
- **JWT Secrets**: Strong, environment-based secrets
- **Role-Based Access Control (RBAC)**: Admin vs User permissions
- **Session Management**: Secure token storage, httpOnly cookies

### API Security
- **Rate Limiting**: 100 requests/15min per IP (configurable)
- **CORS**: Whitelist specific origins
- **Helmet.js**: Security headers
- **CSRF Protection**: Token-based protection for state-changing operations
- **SQL Injection**: Prisma ORM prevents SQL injection
- **XSS Prevention**: Content Security Policy, input sanitization

### Data Protection
- **Environment Variables**: Sensitive data in .env files
- **Database Encryption**: Encrypted connections (SSL/TLS)
- **File Upload Security**: Separate upload directory, no execution permissions
- **Audit Logs**: Track admin actions

---

## ⚡ Performance Strategy

### Frontend Optimization
- **Code Splitting**: Route-based splitting with Next.js
- **Image Optimization**: Next.js Image component, WebP format
- **Font Optimization**: Font subsetting, preload critical fonts
- **Lazy Loading**: Images, components, routes
- **Caching**: SWR for data fetching, browser caching
- **Bundle Size**: Tree shaking, minimize dependencies
- **Core Web Vitals**: Target LCP < 2.5s, FID < 100ms, CLS < 0.1

### Backend Optimization
- **Database Indexing**: Index frequently queried columns
- **Query Optimization**: Efficient Prisma queries, select only needed fields
- **Caching Layer**: Redis for frequently accessed data (optional)
- **Pagination**: Cursor-based pagination for large datasets
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip/Brotli compression for responses

### Canvas Optimization
- **Offscreen Canvas**: Render in background
- **Bitmap Caching**: Cache rendered elements
- **Minimal Redraws**: Only redraw changed areas
- **Hardware Acceleration**: Use CSS transforms where possible

---

## 📱 Responsive Design Strategy

### Breakpoints
```css
/* Mobile First Approach */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Mobile Optimizations
- **Touch Targets**: Minimum 44x44px
- **Viewport Meta**: Proper mobile viewport settings
- **Reduced Motion**: Respect prefers-reduced-motion
- **Offline Support**: Service worker for offline access (optional)

---

## 🚀 Deployment Strategy

### Development Environment
```
Frontend (Web):  http://localhost:3000
Frontend (Admin): http://localhost:3001
Backend API:     http://localhost:5000
Database:        localhost:5432
```

### Production Environment
```
Frontend (Web):  https://banglaquotes.com
Frontend (Admin): https://admin.banglaquotes.com
Backend API:     https://api.banglaquotes.com
Database:        Managed PostgreSQL (e.g., Supabase, Railway, Neon)
```

### Hosting Recommendations
- **Frontend**: Vercel (Next.js optimized)
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: Supabase, Neon, or Railway PostgreSQL
- **File Storage**: Cloudinary, AWS S3, or Vercel Blob
- **CDN**: Cloudflare or Vercel Edge Network

---

## 📋 Development Phases

### Phase 1: Foundation (Week 1)
- ✅ Project setup (monorepo, TypeScript, linting)
- ✅ Database schema design
- ✅ API architecture planning
- ✅ Shared types package
- ✅ Basic backend setup (Express + Prisma)

### Phase 2: Backend Core (Week 2)
- ✅ Authentication system
- ✅ Quote CRUD operations
- ✅ Category CRUD operations
- ✅ Asset management
- ✅ Validation & error handling
- ✅ API documentation

### Phase 3: Admin Panel (Week 3)
- ✅ Admin authentication
- ✅ Dashboard with statistics
- ✅ Quote management UI
- ✅ Category management UI
- ✅ Asset upload & management
- ✅ Bulk upload feature

### Phase 4: Public Web App (Week 4)
- ✅ Homepage
- ✅ Category listing & detail pages
- ✅ Quote detail page
- ✅ Search & filtering
- ✅ Favorites system
- ✅ Responsive design

### Phase 5: Quote Studio (Week 5)
- ✅ Canvas rendering engine
- ✅ Text customization controls
- ✅ Background customization
- ✅ Font selection
- ✅ Color picker
- ✅ Export functionality
- ✅ Share functionality

### Phase 6: Polish & Optimization (Week 6)
- ✅ Performance optimization
- ✅ SEO implementation
- ✅ Accessibility improvements
- ✅ Testing (unit + integration)
- ✅ Bug fixes
- ✅ Documentation

### Phase 7: Deployment & Launch (Week 7)
- ✅ Production deployment
- ✅ Database migration
- ✅ SSL certificates
- ✅ Monitoring setup
- ✅ Analytics integration
- ✅ Final testing

---

## 🧪 Testing Strategy

### Unit Tests
- **Backend**: Jest for services, controllers
- **Frontend**: React Testing Library for components

### Integration Tests
- **API**: Supertest for endpoint testing
- **Database**: Test database with seed data

### E2E Tests (Optional)
- **Playwright**: Critical user flows

### Performance Tests
- **Lighthouse**: Core Web Vitals
- **Load Testing**: Artillery or k6 for API

---

## 📊 Monitoring & Analytics

### Application Monitoring
- **Error Tracking**: Sentry (optional)
- **Performance**: Vercel Analytics
- **Uptime**: UptimeRobot or Pingdom

### User Analytics
- **Page Views**: Custom analytics or Google Analytics
- **User Behavior**: Heatmaps (Hotjar - optional)
- **Quote Interactions**: Custom event tracking

---

## 🔄 Future Enhancements

### Phase 2 Features
- User authentication for favorites
- Social sharing integration
- Quote collections/playlists
- Advanced search with filters
- Multi-language support (beyond Bangla/English)
- Mobile apps (React Native)
- API rate limiting tiers
- Premium features (watermark removal, HD export)

### Technical Improvements
- GraphQL API (alternative to REST)
- Real-time updates (WebSockets)
- Advanced caching (Redis)
- CDN integration for assets
- Progressive Web App (PWA)
- Automated testing pipeline
- A/B testing framework

---

## 📝 Documentation Requirements

### Developer Documentation
- API documentation (Swagger/OpenAPI)
- Database schema documentation
- Component documentation (Storybook - optional)
- Setup & deployment guides

### User Documentation
- Admin panel user guide
- Quote studio tutorial
- FAQ section
- Privacy policy & Terms of service

---

## ✅ Quality Checklist

### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] No console.log in production
- [ ] Proper error handling everywhere
- [ ] Type safety across all layers

### Security
- [ ] Environment variables secured
- [ ] SQL injection prevention verified
- [ ] XSS prevention verified
- [ ] CSRF protection implemented
- [ ] Rate limiting active
- [ ] Authentication tested

### Performance
- [ ] Lighthouse score > 90
- [ ] API response time < 200ms
- [ ] Database queries optimized
- [ ] Images optimized
- [ ] Bundle size minimized

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader compatible
- [ ] Color contrast ratios met

### SEO
- [ ] Meta tags on all pages
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Structured data implemented
- [ ] Open Graph tags added

---

## 🎯 Success Metrics

### Technical Metrics
- **Uptime**: > 99.9%
- **API Response Time**: < 200ms (p95)
- **Page Load Time**: < 2s (LCP)
- **Error Rate**: < 0.1%

### Business Metrics
- **Daily Active Users**: Track growth
- **Quote Downloads**: Track engagement
- **Studio Usage**: Track feature adoption
- **Admin Efficiency**: Time to publish quote

---

This architecture is designed for **5+ years of scalability** with:
- Clean separation of concerns
- Type safety across the stack
- Performance-first approach
- Security best practices
- Maintainable codebase
- Clear upgrade paths
