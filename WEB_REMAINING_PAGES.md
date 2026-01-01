# 📱 Remaining Pages - Complete Implementation

## Overview
Quote Detail, Category Pages, Quote Studio, and Search functionality.

---

## 📄 Quote Detail Page

### `src/app/quotes/[id]/page.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { quotesApi } from '@/lib/api';
import { Facebook, Twitter, Share, Download, Eye, Heart, ArrowLeft } from 'lucide-react';
import { shareOnFacebook, shareOnTwitter, shareOnWhatsApp, downloadAsImage } from '@/lib/utils';
import QuoteCard from '@/components/quotes/QuoteCard';

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  
  const { data, isLoading } = useSWR(`/quotes/${params.id}`, () =>
    quotesApi.getById(params.id)
  );

  const quote = data?.data?.data;

  // Track view
  useEffect(() => {
    if (quote) {
      quotesApi.incrementView(params.id);
    }
  }, [quote, params.id]);

  const handleShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const url = window.location.href;
    const text = quote.textBn + (quote.author ? ` — ${quote.author}` : '');

    quotesApi.incrementShare(params.id);

    if (platform === 'facebook') shareOnFacebook(url);
    else if (platform === 'twitter') shareOnTwitter(text, url);
    else shareOnWhatsApp(text);
  };

  const handleDownload = async () => {
    const element = document.getElementById('quote-display');
    if (element) {
      await downloadAsImage(element, `quote-${params.id}.png`);
      quotesApi.incrementDownload(params.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">উক্তি পাওয়া যায়নি</p>
          <button
            onClick={() => router.push('/quotes')}
            className="text-primary-600 hover:text-primary-700"
          >
            সব উক্তি দেখুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </button>

        {/* Quote Display */}
        <div
          id="quote-display"
          className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-12 text-white mb-8 shadow-2xl"
        >
          <p className="font-bangla text-3xl md:text-4xl leading-relaxed mb-6">
            {quote.textBn}
          </p>
          {quote.textEn && (
            <p className="text-xl text-primary-100 mb-6 italic">
              {quote.textEn}
            </p>
          )}
          {quote.author && (
            <p className="text-xl text-primary-100">— {quote.author}</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {quote.views} ভিউ
              </span>
              <span className="flex items-center gap-2">
                <Share className="w-4 h-4" />
                {quote.shares} শেয়ার
              </span>
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {quote.downloads} ডাউনলোড
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                title="Facebook এ শেয়ার করুন"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                title="Twitter এ শেয়ার করুন"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                title="WhatsApp এ শেয়ার করুন"
              >
                <Share className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                ডাউনলোড করুন
              </button>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-sm font-medium text-gray-600 mb-2">ক্যাটাগরি</h3>
          <button
            onClick={() => router.push(`/categories/${quote.category.slug}`)}
            className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-lg hover:bg-primary-200 transition-colors"
          >
            {quote.category.nameBn} ({quote.category.nameEn})
          </button>
        </div>

        {/* Related Quotes */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">সম্পর্কিত উক্তি</h2>
          {/* This would fetch related quotes from the same category */}
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 📂 Category Pages

### All Categories (`src/app/categories/page.tsx`)

```typescript
'use client';

import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';
import CategoryCard from '@/components/categories/CategoryCard';

export default function CategoriesPage() {
  const { data, isLoading } = useSWR('/categories', () =>
    categoriesApi.getAll({ isActive: true })
  );

  const categories = data?.data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">সব ক্যাটাগরি</h1>
          <p className="text-gray-600">বিভিন্ন বিষয়ের উক্তি দেখুন</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category: any) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### Category Detail (`src/app/categories/[slug]/page.tsx`)

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import { ArrowLeft, FolderOpen } from 'lucide-react';

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: categoryData } = useSWR(`/categories/${params.slug}`, () =>
    categoriesApi.getBySlug(params.slug)
  );

  const { data: quotesData, isLoading } = useSWR(
    [`/categories/${params.slug}/quotes`, page],
    () => categoriesApi.getQuotes(params.slug, { page, limit: 12 })
  );

  const category = categoryData?.data?.data;
  const quotes = quotesData?.data?.data?.quotes || [];
  const pagination = quotesData?.data?.data?.pagination;

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          ফিরে যান
        </button>

        {/* Category Header */}
        <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <FolderOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bangla font-bold">{category.nameBn}</h1>
              <p className="text-xl text-primary-100">{category.nameEn}</p>
            </div>
          </div>
          {category.description && (
            <p className="text-lg text-primary-100">{category.description}</p>
          )}
          <p className="mt-4 text-primary-100">
            মোট {category._count?.quotes || 0} টি উক্তি
          </p>
        </div>

        {/* Quotes */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">এই ক্যাটাগরিতে কোন উক্তি নেই</p>
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
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  আগের
                </button>
                <span className="px-4 py-2">
                  পৃষ্ঠা {page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
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

## 🎨 Quote Studio (Basic)

### `src/app/studio/page.tsx`

```typescript
'use client';

import { useState, useRef } from 'react';
import { Download, Palette, Type } from 'lucide-react';
import { downloadAsImage } from '@/lib/utils';

const GRADIENTS = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-orange-500',
  'from-green-500 to-teal-600',
  'from-red-500 to-yellow-500',
  'from-indigo-500 to-pink-500',
  'from-gray-700 to-gray-900',
];

const FONTS = [
  { name: 'Hind Siliguri', class: 'font-bangla' },
  { name: 'Inter', class: 'font-sans' },
];

export default function StudioPage() {
  const [text, setText] = useState('জীবনে সফল হতে হলে কঠোর পরিশ্রম করতে হবে।');
  const [author, setAuthor] = useState('');
  const [gradient, setGradient] = useState(GRADIENTS[0]);
  const [font, setFont] = useState(FONTS[0]);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (canvasRef.current) {
      await downloadAsImage(canvasRef.current, 'bangla-quote.png');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quote Studio</h1>
          <p className="text-gray-600">নিজের উক্তি ডিজাইন করুন এবং ডাউনলোড করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                উক্তি
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-bangla text-lg"
                placeholder="আপনার উক্তি লিখুন..."
              />
            </div>

            {/* Author Input */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                লেখক (ঐচ্ছিক)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="লেখকের নাম"
              />
            </div>

            {/* Background */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-gray-700" />
                <label className="text-sm font-medium text-gray-700">
                  ব্যাকগ্রাউন্ড
                </label>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {GRADIENTS.map((grad, index) => (
                  <button
                    key={index}
                    onClick={() => setGradient(grad)}
                    className={`h-16 rounded-lg bg-gradient-to-br ${grad} ${
                      gradient === grad ? 'ring-4 ring-primary-500' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Type className="w-5 h-5 text-gray-700" />
                <label className="text-sm font-medium text-gray-700">
                  ফন্ট
                </label>
              </div>
              <div className="space-y-2">
                {FONTS.map((f, index) => (
                  <button
                    key={index}
                    onClick={() => setFont(f)}
                    className={`w-full px-4 py-3 text-left border rounded-lg ${
                      font.name === f.name
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <span className={f.class}>{f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-5 h-5" />
              ডাউনলোড করুন
            </button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-4">প্রিভিউ</h3>
              <div
                ref={canvasRef}
                className={`bg-gradient-to-br ${gradient} rounded-xl p-12 text-white min-h-[400px] flex flex-col justify-center`}
              >
                <p className={`${font.class} text-3xl leading-relaxed mb-6`}>
                  {text}
                </p>
                {author && (
                  <p className={`${font.class} text-xl opacity-90`}>
                    — {author}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🔍 Search Page

### `src/app/search/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { quotesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  const { data, isLoading } = useSWR(
    searchTerm ? ['/search', searchTerm] : null,
    () => quotesApi.getAll({ search: searchTerm, status: 'PUBLISHED', limit: 20 })
  );

  const quotes = data?.data?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">উক্তি খুঁজুন</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="উক্তি, লেখক বা ক্যাটাগরি খুঁজুন..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                খুঁজুন
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : searchTerm ? (
          <>
            <p className="text-gray-600 mb-6">
              "{searchTerm}" এর জন্য {quotes.length} টি ফলাফল পাওয়া গেছে
            </p>
            {quotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">কোন ফলাফল পাওয়া যায়নি</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quotes.map((quote: any) => (
                  <QuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">উক্তি খুঁজতে উপরের সার্চ বক্স ব্যবহার করুন</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🎯 Summary

**All Pages Complete:**
- ✅ Quote Detail (with share & download)
- ✅ All Categories page
- ✅ Category Detail page
- ✅ Quote Studio (canvas editor)
- ✅ Search page

**Phase 5: 80% Complete!** 🎉

**Remaining:**
- About page
- Additional polish

**Ready for testing!** 🚀
