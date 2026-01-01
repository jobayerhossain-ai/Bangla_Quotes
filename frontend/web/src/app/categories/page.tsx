'use client';

import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';
import Link from 'next/link';

export default function AllCategoriesPage() {
    const { data: categories, isLoading } = useSWR('categories', () => categoriesApi.getAll());

    return (
        <div className="bg-white min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold font-bangla text-gray-900 text-center mb-12">
                    সকল ক্যাটাগরি
                </h1>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {isLoading && [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-gray-50 h-32 rounded-xl animate-pulse" />
                    ))}

                    {!isLoading && categories?.data?.data?.map((category: any) => (
                        <Link
                            href={`/categories/${category.slug}`}
                            key={category.id}
                            className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-lg transition-all text-center border border-transparent hover:border-gray-100 group"
                        >
                            <div className="w-16 h-16 bg-white text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                {category.nameBn[0]}
                            </div>
                            <h3 className="text-xl font-bold font-bangla text-gray-900 mb-2">
                                {category.nameBn}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {category._count?.quotes || 0} টি উক্তি
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
