/**
 * useCategories Hook
 * 
 * SWR hook for fetching and managing categories
 */

'use client';

import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';

interface UseCategoriesParams {
    page?: number;
    limit?: number;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export function useCategories(params?: UseCategoriesParams) {
    const { data, error, isLoading, mutate } = useSWR(
        params ? ['/categories', params] : '/categories',
        () => categoriesApi.getAll(params)
    );

    return {
        categories: data?.data?.data || [],
        pagination: data?.data?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

export function useCategory(id: string | null) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/categories/${id}` : null,
        () => id ? categoriesApi.getById(id) : null
    );

    return {
        category: data?.data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}

export function usePopularCategories(limit?: number) {
    const { data, error, isLoading } = useSWR(
        ['/categories/popular', limit],
        () => categoriesApi.getPopular(limit)
    );

    return {
        categories: data?.data?.data || [],
        isLoading,
        isError: error,
    };
}
