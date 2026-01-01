# 🎨 Phase 4: Admin Panel - Implementation Guide

## 📋 Overview

This document provides the complete implementation guide for the Admin Panel. Due to the comprehensive nature of this phase, I've created the foundation and will guide you through the remaining implementation.

---

## ✅ What's Been Created

### 1. Project Setup
- ✅ `apps/admin/package.json` - Dependencies configured
- ✅ `apps/admin/tsconfig.json` - TypeScript config
- ✅ `apps/admin/next.config.js` - Next.js config
- ✅ `apps/admin/tailwind.config.js` - Tailwind CSS config
- ✅ `apps/admin/src/app/globals.css` - Global styles
- ✅ Directory structure created

### 2. Dependencies Installed
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- SWR (data fetching)
- React Hook Form + Zod (forms)
- Lucide React (icons)
- Recharts (charts)
- Axios (API client)

---

## 🏗️ Complete File Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Dashboard
│   │   │   ├── quotes/
│   │   │   │   ├── page.tsx          # Quote list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create quote
│   │   │   │   ├── [id]/
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx  # Edit quote
│   │   │   │   └── bulk/
│   │   │   │       └── page.tsx      # Bulk upload
│   │   │   ├── categories/
│   │   │   │   ├── page.tsx          # Category list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx      # Create category
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx  # Edit category
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   └── Badge.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx
│   │   │   ├── ViewsChart.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── quotes/
│   │   │   ├── QuoteTable.tsx
│   │   │   ├── QuoteForm.tsx
│   │   │   ├── QuoteFilters.tsx
│   │   │   └── BulkUploadForm.tsx
│   │   └── categories/
│   │       ├── CategoryTable.tsx
│   │       └── CategoryForm.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                    # API client
│   │   ├── auth.ts                   # Auth helpers
│   │   ├── utils.ts                  # Utilities
│   │   └── constants.ts              # Constants
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useQuotes.ts
│   │   ├── useCategories.ts
│   │   └── useStats.ts
│   │
│   └── types/
│       └── index.ts                  # Type definitions
│
├── public/
│   └── logo.svg
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 📝 Next Steps: Files to Create

### Priority 1: Core Infrastructure

#### 1. API Client (`src/lib/api.ts`)
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 2. Auth Context (`src/lib/auth.ts`)
```typescript
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const { data } = await api.get('/auth/me');
        setUser(data.data.user);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.data.accessToken);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

#### 3. Root Layout (`src/app/layout.tsx`)
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bangla Quotes - Admin Panel',
  description: 'Admin panel for managing Bangla quotes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

#### 4. Login Page (`src/app/(auth)/login/page.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Bangla Quotes Admin
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          Default: admin@banglaquotes.com / Admin@123456
        </p>
      </div>
    </div>
  );
}
```

---

## 🎯 Implementation Priority

### Week 1: Core Setup
1. ✅ Project initialization
2. ⏳ API client & auth
3. ⏳ Login page
4. ⏳ Dashboard layout (sidebar, header)
5. ⏳ Protected routes

### Week 2: Dashboard
1. ⏳ Stats cards
2. ⏳ Charts (Recharts)
3. ⏳ Recent activity
4. ⏳ Quick actions

### Week 3: Quote Management
1. ⏳ Quote list with filters
2. ⏳ Create quote form
3. ⏳ Edit quote form
4. ⏳ Bulk upload (CSV)
5. ⏳ Delete confirmation

### Week 4: Category Management
1. ⏳ Category list
2. ⏳ Create/Edit forms
3. ⏳ Reorder categories

---

## 🚀 Quick Start

```bash
# Install dependencies
cd apps/admin
npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1" > .env.local

# Start dev server
npm run dev
```

Admin panel will run at: http://localhost:3001

---

## 📊 Current Status

**Phase 4 Progress: 10%**

- ✅ Project setup
- ✅ Dependencies configured
- ✅ Tailwind CSS configured
- ✅ Directory structure
- ⏳ API client (code provided above)
- ⏳ Auth system (code provided above)
- ⏳ Login page (code provided above)
- ⏳ Dashboard layout
- ⏳ All features

---

## 💡 Next Actions

Would you like me to:

1. **Continue creating files** - I'll create the remaining core files
2. **Create specific component** - Tell me which component to create
3. **Provide more code examples** - For specific features
4. **Move to Phase 5** - Start public web app instead

Let me know how to proceed! 🚀
