# 🏠 Homepage & Pages - Complete Implementation

## Overview
Complete code for Homepage and all public pages.

---

## 🏠 Homepage

### Root Layout (`src/app/layout.tsx`)

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bangla Quotes - সুন্দর বাংলা উক্তির সংগ্রহ',
  description: 'জীবন, ভালোবাসা, অনুপ্রেরণা এবং আরও অনেক বিষয়ে সুন্দর বাংলা উক্তি',
  keywords: 'bangla quotes, বাংলা উক্তি, quotes, inspiration, love quotes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

### Homepage (`src/app/page.tsx`)

```typescript
'use client';

import { useState } from 'use';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { quotesApi, categoriesApi } from '@/lib/api';
import { Search, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import QuoteCard from '@/components/quotes/QuoteCard';
import CategoryCard from '@/components/categories/CategoryCard';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: trendingData } = useSWR('/quotes/trending', () =>
    quotesApi.getTrending(6)
  );
  const { data: categoriesData } = useSWR('/categories/popular', () =>
    categoriesApi.getPopular(8)
  );

  const trending = trendingData?.data?.data || [];
  const categories = categoriesData?.data?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              সুন্দর বাংলা উক্তির সংগ্রহ
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 animate-slide-up">
              জীবন, ভালোবাসা, অনুপ্রেরণা এবং আরও অনেক কিছু
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-scale-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="উক্তি খুঁজুন..."
                  className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-2 rounded-full transition-colors"
                >
                  খুঁজুন
                </button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-primary-200">উক্তি</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">20+</div>
                <div className="text-sm text-primary-200">ক্যাটাগরি</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-primary-200">ভিউ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Quotes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary-600" />
              <h2 className="text-3xl font-bold text-gray-900">ট্রেন্ডিং উক্তি</h2>
            </div>
            <button
              onClick={() => router.push('/quotes')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              সব দেখুন
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.map((quote: any) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-secondary-600" />
              <h2 className="text-3xl font-bold text-gray-900">জনপ্রিয় ক্যাটাগরি</h2>
            </div>
            <button
              onClick={() => router.push('/categories')}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              সব দেখুন
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            নিজের উক্তি তৈরি করুন
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Quote Studio দিয়ে সুন্দর ডিজাইনের উক্তি তৈরি করুন এবং শেয়ার করুন
          </p>
          <button
            onClick={() => router.push('/studio')}
            className="bg-white text-primary-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
          >
            Studio তে যান
          </button>
        </div>
      </section>
    </div>
  );
}
```

---

## 📝 Quote Components

### QuoteCard (`src/components/quotes/QuoteCard.tsx`)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { Heart, Share2, Eye } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface QuoteCardProps {
  quote: any;
}

export default function QuoteCard({ quote }: QuoteCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/quotes/${quote.id}`)}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 card-hover"
    >
      <div className="mb-4">
        <p className="font-bangla text-lg text-gray-900 leading-relaxed line-clamp-3">
          {quote.textBn}
        </p>
      </div>

      {quote.author && (
        <p className="text-sm text-gray-600 mb-4">— {quote.author}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {quote.category.nameEn}
        </span>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {formatNumber(quote.views)}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="w-4 h-4" />
            {formatNumber(quote.shares)}
          </span>
        </div>
      </div>
    </div>
  );
}
```

### CategoryCard (`src/components/categories/CategoryCard.tsx`)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface CategoryCardProps {
  category: any;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/categories/${category.slug}`)}
      className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 cursor-pointer card-hover border border-primary-100"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-lg">
          <FolderOpen className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bangla font-bold text-gray-900">{category.nameBn}</h3>
          <p className="text-sm text-gray-600">{category.nameEn}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        {formatNumber(category._count?.quotes || 0)} উক্তি
      </p>
    </div>
  );
}
```

---

## 📄 All Quotes Page

### `src/app/quotes/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { quotesApi, categoriesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import { Filter, Search } from 'lucide-react';

export default function QuotesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status] = useState('PUBLISHED');
  const [categorySlug, setCategorySlug] = useState('');

  const { data: quotesData, isLoading } = useSWR(
    ['/quotes', page, search, status, categorySlug],
    () => quotesApi.getAll({ page, limit: 12, search, status, categorySlug })
  );

  const { data: categoriesData } = useSWR('/categories', () =>
    categoriesApi.getAll({ isActive: true })
  );

  const quotes = quotesData?.data?.data || [];
  const pagination = quotesData?.data?.pagination;
  const categories = categoriesData?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">সব উক্তি</h1>
          <p className="text-gray-600">আমাদের সম্পূর্ণ উক্তির সংগ্রহ দেখুন</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="উক্তি খুঁজুন..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">সব ক্যাটাগরি</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.nameBn}
                </option>
              ))}
            </select>

            {/* Clear */}
            <button
              onClick={() => {
                setSearch('');
                setCategorySlug('');
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              ফিল্টার রিসেট করুন
            </button>
          </div>
        </div>

        {/* Quotes Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">কোন উক্তি পাওয়া যায়নি</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((quote: any) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  আগের
                </button>
                <span className="px-4 py-2 text-gray-700">
                  পৃষ্ঠা {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  পরের
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 Summary

**Homepage & Pages Complete:**
- ✅ Homepage with Hero, Trending, Categories, CTA
- ✅ QuoteCard component
- ✅ CategoryCard component
- ✅ All Quotes page with filters
- ✅ Beautiful animations
- ✅ Responsive design

**Next:**
- Quote Detail page
- Category pages
- Quote Studio
- Search page

**Phase 5 Progress: 40%** 🚀
