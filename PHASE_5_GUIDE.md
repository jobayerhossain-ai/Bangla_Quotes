# 🌐 Phase 5: Public Web App - Complete Implementation Guide

## 📋 Overview

This is the public-facing website for Bangla Quotes platform. Beautiful, responsive, and feature-rich.

---

## 🎯 Features to Build

### 1. Homepage
- Hero section with search
- Featured/trending quotes
- Popular categories
- Call-to-action sections

### 2. Browse Pages
- All quotes (with filters)
- Category pages
- Search results

### 3. Quote Detail
- Full quote display
- Share buttons (Facebook, Twitter, WhatsApp)
- Download as image
- Related quotes

### 4. Quote Studio
- Canvas editor
- Background selection (gradients, images)
- Font customization
- Text positioning
- Export as PNG/JPG

### 5. Additional Pages
- About
- Contact
- Privacy Policy
- Terms of Service

---

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── quotes/
│   │   │   ├── page.tsx                # All quotes
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Quote detail
│   │   ├── categories/
│   │   │   ├── page.tsx                # All categories
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Category quotes
│   │   ├── studio/
│   │   │   └── page.tsx                # Quote Studio
│   │   ├── search/
│   │   │   └── page.tsx                # Search results
│   │   ├── about/
│   │   │   └── page.tsx                # About page
│   │   ├── layout.tsx                  # Root layout
│   │   └── globals.css                 # Global styles
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Container.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedQuotes.tsx
│   │   │   ├── PopularCategories.tsx
│   │   │   └── CTASection.tsx
│   │   ├── quotes/
│   │   │   ├── QuoteCard.tsx
│   │   │   ├── QuoteGrid.tsx
│   │   │   ├── QuoteFilters.tsx
│   │   │   └── ShareButtons.tsx
│   │   ├── studio/
│   │   │   ├── Canvas.tsx
│   │   │   ├── BackgroundPicker.tsx
│   │   │   ├── FontPicker.tsx
│   │   │   └── ExportButton.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       └── Badge.tsx
│   │
│   ├── lib/
│   │   ├── api.ts                      # API client
│   │   ├── utils.ts                    # Utilities
│   │   └── constants.ts                # Constants
│   │
│   └── hooks/
│       ├── useQuotes.ts
│       ├── useCategories.ts
│       └── useSearch.ts
│
├── public/
│   ├── images/
│   │   ├── hero-bg.jpg
│   │   └── gradients/
│   └── fonts/
│
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 🚀 Quick Setup

### Configuration Files

#### `tsconfig.json`
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  },
}

module.exports = nextConfig
```

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        bangla: ['Hind Siliguri', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

#### `.env.example`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 📄 Core Files

### Global Styles (`src/app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Hind+Siliguri:wght@400;600;700&display=swap');

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer utilities {
  .text-gradient {
    @apply bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent;
  }
  
  .card-hover {
    @apply transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }
}
```

### API Client (`src/lib/api.ts`)

```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const quotesApi = {
  getAll: (params?: any) => api.get('/quotes', { params }),
  getById: (id: string) => api.get(`/quotes/${id}`),
  getRandom: (categorySlug?: string) =>
    api.get('/quotes/random', { params: { categorySlug } }),
  getTrending: (limit?: number) =>
    api.get('/quotes/trending', { params: { limit } }),
  incrementView: (id: string) => api.post(`/quotes/${id}/view`),
  incrementShare: (id: string) => api.post(`/quotes/${id}/share`),
  incrementDownload: (id: string) => api.post(`/quotes/${id}/download`),
};

export const categoriesApi = {
  getAll: (params?: any) => api.get('/categories', { params }),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
  getPopular: (limit?: number) =>
    api.get('/categories/popular', { params: { limit } }),
  getQuotes: (slug: string, params?: any) =>
    api.get(`/categories/${slug}/quotes`, { params }),
};
```

### Utilities (`src/lib/utils.ts`)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function shareOnFacebook(url: string) {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

export function shareOnTwitter(text: string, url: string) {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

export function shareOnWhatsApp(text: string) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

export async function downloadAsImage(element: HTMLElement, filename: string) {
  const html2canvas = (await import('html2canvas')).default;
  const canvas = await html2canvas(element);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}
```

---

## 🎨 Key Components

### Navbar (`src/components/layout/Navbar.tsx`)

```typescript
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">বা</span>
            </div>
            <span className="text-xl font-bold text-gradient">Bangla Quotes</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/quotes" className="text-gray-700 hover:text-primary-600 transition-colors">
              Quotes
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              Categories
            </Link>
            <Link href="/studio" className="text-gray-700 hover:text-primary-600 transition-colors">
              Studio
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link
              href="/search"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/quotes"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Quotes
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Categories
            </Link>
            <Link
              href="/studio"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Studio
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              About
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
```

### Footer (`src/components/layout/Footer.tsx`)

```typescript
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Bangla Quotes</h3>
            <p className="text-gray-400 text-sm">
              সুন্দর বাংলা উক্তির সংগ্রহ। জীবন, ভালোবাসা, অনুপ্রেরণা এবং আরও অনেক কিছু।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/quotes" className="text-gray-400 hover:text-white transition-colors">
                  All Quotes
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-gray-400 hover:text-white transition-colors">
                  Quote Studio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Bangla Quotes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

---

## 📊 Status

**Phase 5 Started: 10%**

- ✅ Project setup
- ✅ Configuration files
- ✅ Core utilities
- ✅ Layout components (Navbar, Footer)
- ⏳ Homepage
- ⏳ Quote pages
- ⏳ Category pages
- ⏳ Quote Studio
- ⏳ Search

**Next: Homepage Implementation**

Would you like me to continue with the Homepage and other pages? 🚀
