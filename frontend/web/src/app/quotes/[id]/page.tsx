'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { quotesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';



export default function QuoteDetailPage() {
    const { id } = useParams();

    const { data: quote, isLoading } = useSWR(
        id ? ['quote', id] : null,
        () => quotesApi.getById(id as string)
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!quote?.data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-gray-800">উক্তিটি পাওয়া যায়নি</h1>
                <Link href="/quotes" className="text-primary-600 hover:underline">
                    সকল উক্তি দেখুন
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link
                    href="/quotes"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    ফিরে যান
                </Link>

                <div className="max-w-2xl mx-auto">
                    <QuoteCard quote={quote.data} priority />
                </div>

                {/* Similar/Related Quotes could go here in future */}
            </div>
        </div>
    );
}
