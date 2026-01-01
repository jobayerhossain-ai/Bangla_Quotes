'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { quotesApi } from '@/lib/api';
import QuoteCard from '@/components/quotes/QuoteCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialQuery = searchParams.get('q') || '';
    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery] = useDebounce(query, 500);

    const { data: results, isLoading } = useSWR(
        debouncedQuery ? ['search', debouncedQuery] : null,
        () => quotesApi.getAll({ search: debouncedQuery, limit: 12 })
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Search Header */}
                <div className="max-w-2xl mx-auto mb-12 text-center">
                    <h1 className="text-3xl font-bold font-bangla text-gray-900 mb-6">
                        উক্তি খুঁজুন
                    </h1>
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="কীবোর্ড দিয়ে খুঁজুন..."
                            className="w-full px-6 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg pl-14"
                            autoFocus
                        />
                        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </form>
                </div>

                {/* Results */}
                {debouncedQuery && (
                    <div className="mb-6 text-gray-500">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> খুজছি...
                            </div>
                        ) : (
                            <p>"{debouncedQuery}" এর জন্য {results?.data?.pagination?.total || 0} টি ফলাফল পাওয়া গেছে</p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="bg-white h-64 rounded-xl animate-pulse" />
                        ))
                    ) : (
                        results?.data?.data?.map((quote: any) => (
                            <QuoteCard key={quote.id} quote={quote} />
                        ))
                    )}
                </div>

                {!isLoading && debouncedQuery && results?.data?.data?.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-500 text-lg">কোনো ফলাফল পাওয়া যায়নি</p>
                        <p className="text-gray-400 text-sm mt-2">অন্য কোনো শব্দ দিয়ে চেষ্টা করুন</p>
                    </div>
                )}
            </div>
        </div>
    );
}
