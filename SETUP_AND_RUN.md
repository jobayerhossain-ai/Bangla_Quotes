# 🚀 Setup & Run Guide

## 1. Environment Status
- **Dependencies**: Installing in background... (Wait for `npm install` to finish)
- **Configuration**: `.env` files created.

## 2. Database Setup (Required)
Make sure you have **PostgreSQL** installed and running.

Update `apps/api/.env` if your credentials differ from:
`DATABASE_URL="postgresql://postgres:password@localhost:5432/bangla_quotes?schema=public"`

Then run these commands in a NEW terminal:

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run Migrations (Create Tables)
cd apps/api
npx prisma migrate dev --name init

# 3. Seed Database (Optional - Dummy Data)
npm run prisma:seed
cd ../..
```

## 3. Run the Project
Start all applications (API, Admin, Web) concurrently:

```bash
npm run dev
```

### Access Points
- **Web App**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:5000

## 4. Troubleshooting
- **Database Error**: Check if PostgreSQL is running and credentials in `apps/api/.env` are correct.
- **Port In Use**: Ensure ports 3000, 3001, 5000 are free.
