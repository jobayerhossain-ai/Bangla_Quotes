'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { quotesApi, categoriesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function AllQuotesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const page = Number(searchParams.get('page')) || 1;
    const categoryId = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'newest';

    const { data: quotesData, isLoading } = useSWR(
        ['quotes', page, categoryId, sort],
        () => quotesApi.getAll({
            page,
            limit: 12,
            categoryId,
            sortBy: sort === 'popular' ? 'views' : 'createdAt',
            sortOrder: 'desc'
        })
    );

    const { data: categoriesData } = useSWR('categories', () => categoriesApi.getAll());

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page to 1 on filter change
        if (key !== 'page') {
            params.set('page', '1');
        }
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold font-bangla text-gray-900">
                        সকল উক্তি
                    </h1>

                    <div className="flex flex-wrap gap-3">
                        <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="">সকল ক্যাটাগরি</option>
                                {categoriesData?.data?.data?.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nameBn}
                                    </option>
                                ))}
                            </select>
                            <Filter className="w-4 h-4 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                        </div>

                        <select
                            value={sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="newest">নতুন</option>
                            <option value="popular">জনপ্রিয়</option>
                        </select>
                    </div>
                </div>

                {/* Quotes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && [1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white h-80 rounded-xl animate-pulse" />
                    ))}

                    {!isLoading && quotesData?.data?.data?.map((quote: any) => (
                        <QuoteCard key={quote.id} quote={quote} />
                    ))}
                </div>

                {/* Empty State */}
                {!isLoading && quotesData?.data?.data?.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">কোনো উক্তি পাওয়া যায়নি</p>
                    </div>
                )}

                {/* Pagination */}
                {quotesData?.data?.pagination?.totalPages > 1 && (
                    <div className="flex justify-center mt-12 gap-2">
                        <button
                            onClick={() => handleFilterChange('page', String(page - 1))}
                            disabled={page === 1}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center font-medium">
                            {page} / {quotesData.data.pagination.totalPages}
                        </span>
                        <button
                            onClick={() => handleFilterChange('page', String(page + 1))}
                            disabled={page === quotesData.data.pagination.totalPages}
                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
