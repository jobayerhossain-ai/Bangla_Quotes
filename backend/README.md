# 🚀 Bangla Quotes API - Backend

Enterprise-grade REST API for the Bangla Quotes Platform.

## 📋 Overview

This is the backend API built with:
- **Express.js** - Web framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Zod** - Validation

## 🛠️ Setup

### Prerequisites

- Node.js >= 20.0.0
- PostgreSQL >= 15.0
- npm >= 10.0.0

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Update these variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Strong secret key (min 32 characters)
   - `JWT_REFRESH_SECRET` - Strong refresh secret (min 32 characters)

3. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed the database
   npm run prisma:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

## 📚 API Endpoints

### Health Check
```
GET /health
```

### Authentication (`/api/v1/auth`)
```
POST   /api/v1/auth/register        # Register new user
POST   /api/v1/auth/login           # Login
GET    /api/v1/auth/me              # Get current user (Protected)
POST   /api/v1/auth/refresh         # Refresh access token
POST   /api/v1/auth/change-password # Change password (Protected)
POST   /api/v1/auth/logout          # Logout (Protected)
```

### Quotes (`/api/v1/quotes`) - Coming Soon
```
GET    /api/v1/quotes               # List quotes
GET    /api/v1/quotes/:id           # Get quote by ID
POST   /api/v1/quotes               # Create quote (Admin)
PUT    /api/v1/quotes/:id           # Update quote (Admin)
DELETE /api/v1/quotes/:id           # Delete quote (Admin)
POST   /api/v1/quotes/bulk          # Bulk upload (Admin)
```

### Categories (`/api/v1/categories`) - Coming Soon
```
GET    /api/v1/categories           # List categories
GET    /api/v1/categories/:slug     # Get category by slug
POST   /api/v1/categories           # Create category (Admin)
PUT    /api/v1/categories/:id       # Update category (Admin)
DELETE /api/v1/categories/:id       # Delete category (Admin)
```

### Assets (`/api/v1/assets`) - Coming Soon
```
GET    /api/v1/assets               # List assets
GET    /api/v1/assets/:id           # Get asset by ID
POST   /api/v1/assets               # Upload asset (Admin)
PUT    /api/v1/assets/:id           # Update asset (Admin)
DELETE /api/v1/assets/:id           # Delete asset (Admin)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow

1. **Register or Login**
   ```bash
   POST /api/v1/auth/login
   {
     "email": "admin@banglaquotes.com",
     "password": "Admin@123456"
   }
   ```

2. **Response**
   ```json
   {
     "success": true,
     "data": {
       "user": { ... },
       "accessToken": "eyJhbGc...",
       "refreshToken": "eyJhbGc..."
     }
   }
   ```

3. **Use Access Token**
   
   Include the access token in the Authorization header:
   ```
   Authorization: Bearer <accessToken>
   ```

4. **Refresh Token**
   
   When the access token expires, use the refresh token:
   ```bash
   POST /api/v1/auth/refresh
   {
     "refreshToken": "eyJhbGc..."
   }
   ```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Build
npm run build            # Compile TypeScript to JavaScript

# Production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run prisma:seed      # Seed database with initial data

# Type Checking
npm run type-check       # Check TypeScript types

# Clean
npm run clean            # Remove build artifacts
```

## 🗄️ Database Schema

### Models

- **User** - User accounts (admin, users)
- **Category** - Quote categories
- **Quote** - Bangla quotes
- **StudioAsset** - Assets for quote studio (backgrounds, gradients, fonts)
- **Favorite** - User favorites
- **Analytics** - Usage analytics

See `prisma/schema.prisma` for the complete schema.

## 🔒 Security Features

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Input validation with Zod
- ✅ Rate limiting (100 req/15min)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ SQL injection protection (Prisma ORM)
- ✅ XSS prevention

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2025-12-31T10:34:43Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2025-12-31T10:34:43Z"
}
```

### Paginated Response
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

## 🧪 Testing

```bash
# Run tests (coming soon)
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
apps/api/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment configuration
│   ├── controllers/
│   │   └── auth.controller.ts  # Request handlers
│   ├── middleware/
│   │   ├── auth.middleware.ts  # Authentication
│   │   ├── error.middleware.ts # Error handling
│   │   ├── rateLimit.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   └── auth.routes.ts      # Route definitions
│   ├── services/
│   │   └── auth.service.ts     # Business logic
│   ├── utils/
│   │   ├── ApiError.ts         # Custom error class
│   │   ├── jwt.ts              # JWT utilities
│   │   └── response.ts         # Response formatters
│   ├── validators/
│   │   └── auth.validator.ts   # Zod schemas
│   ├── app.ts                  # Express app setup
│   └── index.ts                # Entry point
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
├── uploads/                    # File uploads
├── .env                        # Environment variables
├── .env.example                # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Deployment

### Environment Variables (Production)

Make sure to set these in production:

```env
NODE_ENV=production
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-secret-min-32-chars>
JWT_REFRESH_SECRET=<strong-secret-min-32-chars>
CORS_ORIGIN=<production-frontend-url>
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Deploy to Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd apps/api && npm install && npm run build`
4. Set start command: `cd apps/api && npm start`
5. Add environment variables

## 📞 Support

For issues or questions, please open an issue on GitHub.

## 📄 License

MIT License
