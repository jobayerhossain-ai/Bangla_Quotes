# 🔧 Phase 1 & 2 - Missing Files & Polish

## Overview
Identifying and fixing missing files from Phase 1 (Foundation) and Phase 2 (Backend Core).

---

## ✅ Phase 1 Review

### Missing Files Identified:

1. **`.prettierrc`** - Code formatting configuration
2. **`.eslintrc.json`** - Root ESLint configuration
3. **`.nvmrc`** - Node version specification
4. **`CONTRIBUTING.md`** - Contribution guidelines
5. **`LICENSE`** - Project license

---

## 📝 Missing Files Implementation

### 1. Prettier Configuration (`.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "bracketSpacing": true,
  "jsxSingleQuote": false,
  "quoteProps": "as-needed"
}
```

### 2. Root ESLint Configuration (`.eslintrc.json`)

```json
{
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 2021,
    "sourceType": "module"
  },
  "env": {
    "node": true,
    "es2021": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-console": "warn"
  },
  "ignorePatterns": ["node_modules/", "dist/", ".next/", "build/"]
}
```

### 3. Node Version (`.nvmrc`)

```
20.10.0
```

### 4. Contributing Guidelines (`CONTRIBUTING.md`)

```markdown
# Contributing to Bangla Quotes Platform

Thank you for your interest in contributing! 🎉

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a new branch
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

\`\`\`bash
# Install dependencies
npm install

# Setup database
cd apps/api
npx prisma generate
npx prisma migrate dev
npm run prisma:seed

# Start development servers
npm run dev
\`\`\`

## Code Style

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

## Commit Message Format

\`\`\`
type(scope): subject

body

footer
\`\`\`

Types: feat, fix, docs, style, refactor, test, chore

## Pull Request Process

1. Update documentation
2. Add tests if applicable
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review

## Code of Conduct

- Be respectful
- Be inclusive
- Be collaborative
- Be constructive

## Questions?

Open an issue or contact the maintainers.

Thank you! 🙏
```

### 5. License (`LICENSE`)

```
MIT License

Copyright (c) 2024 Bangla Quotes Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ✅ Phase 2 Review

### Missing Files Identified:

1. **`apps/api/.eslintrc.json`** - API-specific ESLint
2. **`apps/api/.prettierrc`** - API-specific Prettier
3. **`apps/api/jest.config.js`** - Testing configuration
4. **`apps/api/Dockerfile`** - Docker configuration
5. **`apps/api/.dockerignore`** - Docker ignore
6. **`apps/api/src/types/express.d.ts`** - Express type extensions

---

## 📝 Phase 2 Missing Files

### 1. API ESLint (`apps/api/.eslintrc.json`)

```json
{
  "extends": ["../../.eslintrc.json"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["error", "warn"] }]
  }
}
```

### 2. API Prettier (`apps/api/.prettierrc`)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

### 3. Jest Configuration (`apps/api/jest.config.js`)

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.interface.ts',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### 4. Dockerfile (`apps/api/Dockerfile`)

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/shared-types/package*.json ./packages/shared-types/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
WORKDIR /app/apps/api
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/apps/api/prisma ./prisma

# Install production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/apps/api/dist ./dist

# Generate Prisma Client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
```

### 5. Docker Ignore (`apps/api/.dockerignore`)

```
node_modules
npm-debug.log
dist
.env
.env.local
.env.*.local
coverage
.git
.gitignore
README.md
.vscode
.idea
*.md
uploads/*
!uploads/.gitkeep
```

### 6. Express Type Extensions (`apps/api/src/types/express.d.ts`)

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

---

## 🔧 Additional Polish

### 1. Update Root Package.json Scripts

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules",
    "test": "turbo run test"
  }
}
```

### 2. Add .gitkeep Files

Create empty `.gitkeep` files in:
- `apps/api/uploads/.gitkeep`
- `apps/api/src/types/.gitkeep`
- `apps/admin/public/.gitkeep`
- `apps/web/public/.gitkeep`

### 3. Environment Variable Validation

Add to `apps/api/src/config/env.ts`:

```typescript
// Validate all required environment variables on startup
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
```

### 4. Health Check Endpoint

Ensure this exists in `apps/api/src/routes/health.routes.ts`:

```typescript
import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/health', async (req, res) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

export default router;
```

---

## 📊 Checklist

### Phase 1 Files
- [ ] `.prettierrc`
- [ ] `.eslintrc.json`
- [ ] `.nvmrc`
- [ ] `CONTRIBUTING.md`
- [ ] `LICENSE`

### Phase 2 Files
- [ ] `apps/api/.eslintrc.json`
- [ ] `apps/api/.prettierrc`
- [ ] `apps/api/jest.config.js`
- [ ] `apps/api/Dockerfile`
- [ ] `apps/api/.dockerignore`
- [ ] `apps/api/src/types/express.d.ts`

### Polish Items
- [ ] Update root package.json scripts
- [ ] Add .gitkeep files
- [ ] Add environment validation
- [ ] Add health check endpoint
- [ ] Format all code with Prettier
- [ ] Run ESLint and fix issues

---

## 🚀 Next Steps

1. Create all missing files
2. Run `npm run format` to format code
3. Run `npm run lint` to check for issues
4. Run `npm run type-check` to verify types
5. Test all applications
6. Commit changes

---

## ✅ Status

**Phase 1 & 2 Polish: Ready to implement!**

All missing files identified and code provided above.
