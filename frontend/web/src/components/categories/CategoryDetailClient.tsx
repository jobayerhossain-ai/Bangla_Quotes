'use client';

import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CategoryDetailClientProps {
    slug: string;
}

export default function CategoryDetailClient({ slug }: CategoryDetailClientProps) {
    const { data: categoryData, isLoading: isCategoryLoading } = useSWR(
        slug ? ['category', slug] : null,
        () => categoriesApi.getBySlug(slug)
    );

    const { data: quotesData, isLoading: isQuotesLoading } = useSWR(
        slug ? ['category-quotes', slug] : null,
        () => categoriesApi.getQuotes(slug)
    );

    const isLoading = isCategoryLoading || isQuotesLoading;

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        সকল ক্যাটাগরি
                    </Link>

                    {isCategoryLoading ? (
                        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold font-bangla text-gray-900 mb-2">
                                {categoryData?.data?.data?.nameBn}
                            </h1>
                            <p className="text-gray-500">
                                এই ক্যাটাগরিতে {categoryData?.data?.data?._count?.quotes || 0} টি উক্তি রয়েছে
                            </p>
                        </div>
                    )}
                </div>

                {/* Quotes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white h-80 rounded-xl animate-pulse" />
                    ))}

                    {!isLoading && quotesData?.data?.data?.quotes?.map((quote: any) => (
                        <QuoteCard key={quote.id} quote={quote} />
                    ))}
                </div>

                {!isLoading && quotesData?.data?.data?.quotes?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-lg">এই ক্যাটাগরিতে এখনো কোনো উক্তি নেই</p>
                    </div>
                )}
            </div>
        </div>
    );
}
