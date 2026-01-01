'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles, Search } from 'lucide-react';
import { quotesApi, categoriesApi } from '@/lib/api';
import useSWR from 'swr';
import QuoteCard from '@/components/quotes/QuoteCard';
import CategoryCard from '@/components/categories/CategoryCard';

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { data: trendingQuotes } = useSWR('trending', () => quotesApi.getTrending(6));
    const { data: popularCategories } = useSWR('categories', () => categoriesApi.getPopular(8));

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-24 md:py-32 px-4 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold font-bangla text-gray-900 leading-tight tracking-tight">
                        মনের কথা বলুন <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                            সুন্দর উক্তির মাধ্যমে
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        হাজারো বাংলা উক্তি, স্ট্যাটাস এবং ক্যাপশনের বিশাল সংগ্রহ। <br className="hidden md:block" />
                        আপনার অনুভূতি প্রকাশের সেরা সঙ্গী।
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity" />
                        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 p-2">
                            <Search className="w-5 h-5 text-gray-400 ml-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="উক্তি খুঁজুন (যেমন: ভালোবাসা, জীবন...)"
                                className="flex-1 px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 placeholder-gray-400 font-bangla outline-none"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-full font-medium transition-colors flex items-center gap-2"
                            >
                                খুঁজুন
                            </button>
                        </div>
                    </form>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                        <Link
                            href="/quotes"
                            className="text-gray-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1 text-sm underline-offset-4 hover:underline"
                        >
                            সব উক্তি দেখুন <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/studio"
                            className="text-gray-600 hover:text-secondary-600 font-medium transition-colors flex items-center gap-1 text-sm underline-offset-4 hover:underline"
                        >
                            উক্তি স্টুডিও <Sparkles className="w-3 h-3" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Trending Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold font-bangla text-gray-900">জনপ্রিয় উক্তি</h2>
                        <p className="text-gray-500 mt-1">সবাই যা পছন্দ করছে</p>
                    </div>
                    <Link href="/quotes?sort=popular" className="px-5 py-2.5 rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 font-medium text-sm transition-colors border border-gray-200">
                        আরও দেখুন
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trendingQuotes?.data?.data?.map((quote: any, idx: number) => (
                        <QuoteCard key={quote.id} quote={quote} priority={idx < 3} />
                    ))}
                    {!trendingQuotes && [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-xl h-[350px] animate-pulse border border-gray-100 shadow-sm" />
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold font-bangla text-gray-900">বিষয়ভিত্তিক</h2>
                            <p className="text-gray-500 mt-1">পছন্দের বিষয়ে উক্তি খুঁজুন</p>
                        </div>
                        <Link href="/categories" className="px-5 py-2.5 rounded-full bg-white text-gray-900 hover:bg-gray-50 font-medium text-sm transition-colors border border-gray-200 shadow-sm">
                            সব বিষয়
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {popularCategories?.data?.data?.map((category: any) => (
                            <CategoryCard key={category.id} category={category} />
                        ))}
                        {!popularCategories && [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-white h-48 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action - Studio */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 md:p-16 text-center md:text-left relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl space-y-6">
                            <h2 className="text-3xl md:text-4xl font-bold font-bangla text-white leading-tight">
                                নিজের উক্তি নিজেই সাজান <br />
                                <span className="text-primary-400">স্টুডিও ফিচারের মাধ্যমে</span>
                            </h2>
                            <p className="text-gray-300 text-lg">
                                ব্যাকগ্রাউন্ড, ফন্ট এবং কালার পরিবর্তন করে তৈরি করুন দারুণ সব ইমেজ কোট। শেয়ার করুন বন্ধুদের সাথে।
                            </p>
                            <Link
                                href="/studio"
                                className="inline-flex px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-primary-500/25 items-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" />
                                স্টুডিওতে যান
                            </Link>
                        </div>

                        {/* Abstract Visual Representation */}
                        <div className="hidden md:block relative w-64 h-64">
                            <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full animate-pulse" />
                            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl rotate-3 shadow-xl">
                                <p className="text-white font-bangla text-center text-lg">
                                    "জীবন সুন্দর, যদি আপনি সুন্দর করে দেখেন।"
                                </p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl -rotate-6 shadow-xl w-3/4">
                                <div className="h-2 bg-white/20 rounded w-full mb-2" />
                                <div className="h-2 bg-white/20 rounded w-2/3" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
