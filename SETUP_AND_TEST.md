# 🚀 Quick API Setup & Testing Guide

## ধাপ ১: Dependencies Install করুন

```bash
# Project root এ যান
cd C:\Users\jovay\.gemini\antigravity\scratch\bangla-quotes-platform

# Shared types build করুন
cd packages\shared-types
npm install
npm run build

# API dependencies install করুন
cd ..\..\apps\api
npm install
```

## ধাপ ২: PostgreSQL Database Setup

### Option A: pgAdmin ব্যবহার করে

1. **pgAdmin খুলুন**
2. **Right-click on "Databases" → Create → Database**
3. **Database name**: `bangla_quotes`
4. **Save**

### Option B: Command Line ব্যবহার করে

```bash
# PostgreSQL এ login করুন
psql -U postgres

# Database তৈরি করুন
CREATE DATABASE bangla_quotes;

# Exit
\q
```

## ধাপ ৩: Environment Variables

`.env` ফাইল তৈরি করুন (যদি না থাকে):

```bash
# apps/api ফোল্ডারে
copy .env.example .env
```

`.env` ফাইল edit করুন এবং `DATABASE_URL` আপডেট করুন:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bangla_quotes?schema=public"
```

`YOUR_PASSWORD` এর জায়গায় আপনার PostgreSQL password দিন।

## ধাপ ৪: Database Migration & Seed

```bash
# Prisma Client generate করুন
npx prisma generate

# Migrations run করুন
npx prisma migrate dev --name init

# Database seed করুন
npm run prisma:seed
```

**Expected Output:**
```
🌱 Starting database seed...

📝 Seeding admin user...
✅ Admin user created: admin@banglaquotes.com

📂 Seeding categories...
✅ Created 8 categories

💬 Seeding quotes...
✅ Created 5 quotes

🎨 Seeding studio assets...
✅ Created 3 gradients

✅ Database seed completed successfully!
```

## ধাপ ৫: Server চালু করুন

```bash
npm run dev
```

**Expected Output:**
```
✅ Database connected successfully

🚀 Bangla Quotes API Server Started
=====================================
📍 Environment: development
🌐 Server: http://localhost:5000
🏥 Health: http://localhost:5000/health
📚 API: http://localhost:5000/api/v1
=====================================
```

## ধাপ ৬: Health Check Test

Browser এ যান: http://localhost:5000/health

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-31T11:12:24.000Z",
  "environment": "development"
}
```

## ধাপ ৭: API Welcome Test

Browser এ যান: http://localhost:5000/api/v1

**Expected Response:**
```json
{
  "message": "Welcome to Bangla Quotes API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/v1/auth",
    "quotes": "/api/v1/quotes",
    "categories": "/api/v1/categories",
    "assets": "/api/v1/assets"
  }
}
```

---

## 🧪 API Testing (Using cURL or Browser)

### Test 1: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@banglaquotes.com\",\"password\":\"Admin@123456\"}"
```

**Save the `accessToken` from response!**

### Test 2: Get All Categories

```bash
curl http://localhost:5000/api/v1/categories
```

### Test 3: Get All Quotes

```bash
curl http://localhost:5000/api/v1/quotes
```

### Test 4: Get Random Quote

```bash
curl http://localhost:5000/api/v1/quotes/random
```

### Test 5: Get Trending Quotes

```bash
curl http://localhost:5000/api/v1/quotes/trending
```

---

## 🎯 Thunder Client / Postman Setup

### Thunder Client (VS Code Extension)

1. **Install Extension**: Thunder Client
2. **Create New Request**
3. **Import Collection**: Use `API_TESTING_GUIDE.md` examples

### Quick Tests:

**1. Login**
- Method: POST
- URL: `http://localhost:5000/api/v1/auth/login`
- Body (JSON):
```json
{
  "email": "admin@banglaquotes.com",
  "password": "Admin@123456"
}
```

**2. Get Categories**
- Method: GET
- URL: `http://localhost:5000/api/v1/categories`

**3. Create Quote (Admin)**
- Method: POST
- URL: `http://localhost:5000/api/v1/quotes`
- Headers:
  - `Authorization`: `Bearer YOUR_ACCESS_TOKEN`
  - `Content-Type`: `application/json`
- Body:
```json
{
  "textBn": "পরীক্ষামূলক উক্তি",
  "textEn": "Test quote",
  "author": "Test Author",
  "categoryId": "GET_FROM_CATEGORIES_RESPONSE",
  "status": "PUBLISHED"
}
```

---

## ✅ Testing Checklist

### Basic Tests
- [ ] Server starts successfully
- [ ] Health check works
- [ ] API welcome page works
- [ ] Database connection works

### Authentication
- [ ] Login with correct credentials ✅
- [ ] Login with wrong password (should fail)
- [ ] Access admin route without token (should fail)

### Categories
- [ ] Get all categories ✅
- [ ] Get category by slug ✅
- [ ] Get popular categories ✅
- [ ] Create category (admin) ✅
- [ ] Update category (admin) ✅

### Quotes
- [ ] Get all quotes ✅
- [ ] Get quote by ID ✅
- [ ] Get random quote ✅
- [ ] Get trending quotes ✅
- [ ] Create quote (admin) ✅
- [ ] Update quote (admin) ✅
- [ ] Bulk create quotes (admin) ✅
- [ ] Track view/share/download ✅

### Advanced Features
- [ ] Pagination works
- [ ] Filtering works
- [ ] Sorting works
- [ ] Search works (Bangla & English)
- [ ] Slug auto-generation works

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
```bash
# Check PostgreSQL is running
sc query postgresql-x64-15

# Start PostgreSQL
net start postgresql-x64-15

# Verify DATABASE_URL in .env
```

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npx prisma generate
```

### Issue: "Port 5000 already in use"

**Solution:**
Change port in `.env`:
```env
PORT=5001
```

### Issue: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📊 Expected Database State After Seed

**Users:** 1
- admin@banglaquotes.com (SUPER_ADMIN)

**Categories:** 8
- অনুপ্রেরণা (Inspiration)
- ভালোবাসা (Love)
- জীবন (Life)
- বন্ধুত্ব (Friendship)
- সফলতা (Success)
- শিক্ষা (Education)
- পরিবার (Family)
- প্রকৃতি (Nature)

**Quotes:** 5
- Sample quotes from Einstein, Churchill, Tagore, etc.

**Studio Assets:** 3
- Gradient backgrounds (Sunset, Ocean, Forest)

---

## 🎯 Next: Prisma Studio (Database GUI)

```bash
npx prisma studio
```

Opens at: http://localhost:5555

এখানে আপনি:
- সব tables দেখতে পারবেন
- Data add/edit/delete করতে পারবেন
- Relationships দেখতে পারবেন

---

## ✅ All Tests Passed?

যদি সব test pass করে, তাহলে আপনার API সম্পূর্ণভাবে কাজ করছে! 🎉

**এখন Phase 4 (Admin Panel) শুরু করতে পারি!** 🚀
