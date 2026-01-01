# 🚀 Quick Start Guide

## প্রথমে যা করতে হবে (Prerequisites)

1. **Node.js 20+** ইনস্টল করুন
2. **PostgreSQL 15+** ইনস্টল করুন
3. **Git** ইনস্টল করুন (optional)

---

## ⚡ দ্রুত শুরু করুন (5 মিনিটে)

### Step 1: Dependencies ইনস্টল করুন

```bash
# Project root এ যান
cd C:\Users\jovay\.gemini\antigravity\scratch\bangla-quotes-platform

# Shared types build করুন
cd packages\shared-types
npm install
npm run build

# API dependencies ইনস্টল করুন
cd ..\..\apps\api
npm install
```

### Step 2: PostgreSQL Database তৈরি করুন

**Option A: pgAdmin ব্যবহার করে**
1. pgAdmin খুলুন
2. নতুন database তৈরি করুন: `bangla_quotes`
3. Connection string copy করুন

**Option B: Command Line ব্যবহার করে**
```bash
# PostgreSQL এ login করুন
psql -U postgres

# Database তৈরি করুন
CREATE DATABASE bangla_quotes;

# Exit করুন
\q
```

### Step 3: Environment Variables সেট করুন

`.env` ফাইল তৈরি করুন:

```bash
# apps/api ফোল্ডারে
cd apps\api
copy .env.example .env
```

`.env` ফাইল edit করুন এবং `DATABASE_URL` আপডেট করুন:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/bangla_quotes?schema=public"
```

`YOUR_PASSWORD` এর জায়গায় আপনার PostgreSQL password দিন।

### Step 4: Database Setup করুন

```bash
# Prisma Client generate করুন
npx prisma generate

# Migrations run করুন
npx prisma migrate dev --name init

# Database seed করুন (initial data)
npm run prisma:seed
```

### Step 5: Server চালু করুন

```bash
npm run dev
```

✅ **Server চালু হয়ে গেছে!** 

- API: http://localhost:5000
- Health Check: http://localhost:5000/health
- API Docs: http://localhost:5000/api/v1

---

## 🧪 Test করুন

### 1. Health Check

Browser এ যান: http://localhost:5000/health

অথবা terminal এ:
```bash
curl http://localhost:5000/health
```

### 2. Login Test

```bash
curl -X POST http://localhost:5000/api/v1/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@banglaquotes.com\",\"password\":\"Admin@123456\"}"
```

Response এ `accessToken` পাবেন।

### 3. Get Current User

```bash
curl http://localhost:5000/api/v1/auth/me ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

`YOUR_ACCESS_TOKEN` এর জায়গায় login response থেকে পাওয়া token দিন।

---

## 🎯 Default Credentials

**Admin Account:**
- Email: `admin@banglaquotes.com`
- Password: `Admin@123456`

**⚠️ Production এ অবশ্যই পরিবর্তন করবেন!**

---

## 📊 Prisma Studio (Database GUI)

Database দেখতে চাইলে:

```bash
cd apps\api
npx prisma studio
```

Browser এ খুলবে: http://localhost:5555

এখানে আপনি:
- সব tables দেখতে পারবেন
- Data add/edit/delete করতে পারবেন
- Relationships দেখতে পারবেন

---

## 🔧 Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
```

### Database
```bash
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create new migration
npx prisma db seed       # Seed database
npx prisma generate      # Generate Prisma Client
```

### Debugging
```bash
npm run type-check       # Check TypeScript errors
npx prisma validate      # Validate schema
```

---

## ❌ Common Issues & Solutions

### Issue 1: "Cannot connect to database"

**Solution:**
1. PostgreSQL চালু আছে কিনা check করুন
2. `.env` এ `DATABASE_URL` সঠিক আছে কিনা check করুন
3. Database তৈরি হয়েছে কিনা check করুন

```bash
# PostgreSQL status check (Windows)
sc query postgresql-x64-15

# Start PostgreSQL
net start postgresql-x64-15
```

### Issue 2: "Prisma Client not generated"

**Solution:**
```bash
cd apps\api
npx prisma generate
```

### Issue 3: "Port 5000 already in use"

**Solution:**
`.env` ফাইলে port পরিবর্তন করুন:
```env
PORT=5001
```

### Issue 4: "Module not found"

**Solution:**
```bash
# Dependencies reinstall করুন
cd apps\api
rm -rf node_modules
npm install
```

---

## 📚 Next Steps

1. ✅ **API Test করুন** - Postman বা Thunder Client দিয়ে
2. ✅ **Database Explore করুন** - Prisma Studio দিয়ে
3. ✅ **Code Review করুন** - `apps/api/src` folder explore করুন
4. ⏳ **Phase 3 শুরু করুন** - Quote & Category Management

---

## 🆘 Help Needed?

- **Documentation:** `ARCHITECTURE.md`, `IMPLEMENTATION_PLAN.md`
- **API Docs:** `apps/api/README.md`
- **Phase 2 Summary:** `PHASE_2_COMPLETE.md`

---

**Happy Coding! 🚀**
