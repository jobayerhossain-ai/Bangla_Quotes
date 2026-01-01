/**
 * useQuotes Hook
 * 
 * SWR hook for fetching and managing quotes
 */

'use client';

import useSWR from 'swr';
import { quotesApi } from '@/lib/api';

interface UseQuotesParams {
    page?: number;
    limit?: number;
    status?: string;
    categorySlug?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export function useQuotes(params?: UseQuotesParams) {
    const { data, error, isLoading, mutate } = useSWR(
        params ? ['/quotes', params] : '/quotes',
        () => quotesApi.getAll(params)
    );

    return {
        quotes: data?.data?.data || [],
        pagination: data?.data?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useQuote(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/quotes/${id}` : null,
        () => id ? quotesApi.getById(id) : null
    );

    return {
        quote: data?.data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useTrendingQuotes(limit?: number) {
    const { data, error, isLoading } = useSWR(
        ['/quotes/trending', limit],
        () => quotesApi.getTrending(limit)
    );

    return {
        quotes: data?.data?.data || [],
        isLoading,
        isError: error,
    };
}
