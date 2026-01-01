# 🔧 Phase 3 & 4 - Missing Files & Polish

## Overview
Reviewing Phase 3 (Quote & Category Management) and Phase 4 (Admin Panel) for missing files and improvements.

---

## ✅ Phase 3 Review (Backend API)

### Missing Files Identified:

1. **`apps/api/src/lib/prisma.ts`** - Prisma client instance
2. **`apps/api/src/types/express.d.ts`** - Express type extensions
3. **`apps/api/src/routes/health.routes.ts`** - Health check endpoint
4. **`apps/api/src/routes/index.ts`** - Route aggregator
5. **`apps/api/jest.config.js`** - Testing configuration
6. **`apps/api/src/__tests__/`** - Test files directory

---

## 📝 Phase 3 Missing Files Implementation

### 1. Prisma Client Instance (`apps/api/src/lib/prisma.ts`)

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

### 2. Express Type Extensions (`apps/api/src/types/express.d.ts`)

```typescript
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export {};
```

### 3. Health Check Routes (`apps/api/src/routes/health.routes.ts`)

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      database: 'connected',
      version: process.env.npm_package_version || '1.0.0',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * @route   GET /api/v1/
 * @desc    Welcome endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Bangla Quotes API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
    health: '/api/v1/health',
  });
});

export default router;
```

### 4. Route Aggregator (`apps/api/src/routes/index.ts`)

```typescript
import { Router } from 'express';
import authRoutes from './auth.routes';
import quoteRoutes from './quote.routes';
import categoryRoutes from './category.routes';
import healthRoutes from './health.routes';

const router = Router();

// Health check (no /api/v1 prefix needed)
router.use('/', healthRoutes);

// API routes
router.use('/auth', authRoutes);
router.use('/quotes', quoteRoutes);
router.use('/categories', categoryRoutes);

export default router;
```

### 5. Jest Configuration (`apps/api/jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/index.ts',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  testTimeout: 10000,
};
```

### 6. Test Setup (`apps/api/src/__tests__/setup.ts`)

```typescript
import { prisma } from '../lib/prisma';

// Setup before all tests
beforeAll(async () => {
  // Connect to test database
  await prisma.$connect();
});

// Cleanup after all tests
afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

// Clear database between tests
afterEach(async () => {
  const tables = ['User', 'Quote', 'Category', 'Analytics', 'Favorite'];
  
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE;`);
  }
});
```

### 7. Sample Test (`apps/api/src/__tests__/auth.test.ts`)

```typescript
import request from 'supertest';
import app from '../app';
import { prisma } from '../lib/prisma';

describe('Auth API', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456',
          name: 'Test User',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user).toHaveProperty('email', 'test@example.com');
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should not register with duplicate email', async () => {
      // Create user first
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'hashedpassword',
          name: 'Test User',
        },
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456',
          name: 'Test User',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Register user first
      await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Test@123456',
          name: 'Test User',
        });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Test@123456',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });
});
```

---

## ✅ Phase 4 Review (Admin Panel)

### Missing Files Identified:

1. **`apps/admin/.prettierrc`** - Prettier configuration
2. **`apps/admin/README.md`** - Admin panel documentation
3. **`apps/admin/public/.gitkeep`** - Keep public directory
4. **`apps/admin/src/middleware.ts`** - Next.js middleware for auth
5. **`apps/admin/.env.local`** - Local environment (gitignored)

---

## 📝 Phase 4 Missing Files Implementation

### 1. Prettier Configuration (`apps/admin/.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### 2. Admin README (`apps/admin/README.md`)

```markdown
# 🎨 Bangla Quotes - Admin Panel

Professional admin panel for managing the Bangla Quotes platform.

## 🚀 Features

- **Dashboard** - Stats, trending quotes, categories overview
- **Quote Management** - CRUD operations, bulk upload, filters
- **Category Management** - CRUD operations, auto slug generation
- **Settings** - Profile, password change

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: SWR
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## 🛠️ Setup

### Prerequisites
- Node.js >= 20.0.0
- Backend API running on http://localhost:5000

### Installation

\`\`\`bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

# Start development server
npm run dev
\`\`\`

Admin panel will run at: **http://localhost:3001**

## 🔐 Default Credentials

- **Email**: admin@banglaquotes.com
- **Password**: Admin@123456

⚠️ **Change these in production!**

## 📁 Project Structure

\`\`\`
src/
├── app/
│   ├── (dashboard)/        # Protected routes
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components
│   └── dashboard/          # Dashboard components
├── lib/
│   ├── api.ts             # API client
│   ├── auth.ts            # Auth context
│   └── utils.ts           # Utilities
└── hooks/                 # Custom hooks
\`\`\`

## 🎯 Available Scripts

\`\`\`bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
\`\`\`

## 📝 License

MIT License
```

### 3. Next.js Middleware (`apps/admin/src/middleware.ts`)

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';
  const isDashboard = request.nextUrl.pathname.startsWith('/');

  // Redirect to login if not authenticated and trying to access dashboard
  if (!token && isDashboard && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to dashboard if authenticated and trying to access login
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 4. .gitkeep Files

Create empty `.gitkeep` files in:
- `apps/admin/public/.gitkeep`
- `apps/api/uploads/.gitkeep`

---

## 🔧 Additional Improvements

### 1. Update API app.ts to use route aggregator

```typescript
// apps/api/src/app.ts
import routes from './routes';

// Use aggregated routes
app.use('/api/v1', routes);
```

### 2. Add package.json test script

```json
// apps/api/package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@types/jest": "^29.5.11",
    "@types/supertest": "^6.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "ts-jest": "^29.1.1"
  }
}
```

### 3. Environment Validation

Add to `apps/api/src/config/env.ts`:

```typescript
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  console.log('✅ Environment variables validated');
}

// Call in index.ts before starting server
validateEnv();
```

---

## 📊 Checklist

### Phase 3 Files
- [ ] `apps/api/src/lib/prisma.ts`
- [ ] `apps/api/src/types/express.d.ts`
- [ ] `apps/api/src/routes/health.routes.ts`
- [ ] `apps/api/src/routes/index.ts`
- [ ] `apps/api/jest.config.js`
- [ ] `apps/api/src/__tests__/setup.ts`
- [ ] `apps/api/src/__tests__/auth.test.ts`

### Phase 4 Files
- [ ] `apps/admin/.prettierrc`
- [ ] `apps/admin/README.md`
- [ ] `apps/admin/src/middleware.ts`
- [ ] `apps/admin/public/.gitkeep`

### Improvements
- [ ] Update app.ts to use route aggregator
- [ ] Add test scripts to package.json
- [ ] Add environment validation
- [ ] Create .gitkeep files

---

## 🚀 Testing

### Run Backend Tests

\`\`\`bash
cd apps/api
npm test
\`\`\`

### Run Admin Type Check

\`\`\`bash
cd apps/admin
npm run type-check
\`\`\`

---

## ✅ Status

**Phase 3 & 4 Polish: Ready to implement!**

All missing files identified and code provided above.
