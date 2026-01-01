import useSWR from 'swr';
import { assetsApi } from '@/lib/api';

interface UseAssetsParams {
    page?: number;
    limit?: number;
    type?: string;
    isActive?: boolean;
    isPremium?: boolean;
}

export function useAssets(params?: UseAssetsParams) {
    const { data, error, mutate } = useSWR(
        ['/assets', params],
        () => assetsApi.getAll(params).then((res) => res.data.data)
    );

    return {
        assets: data?.data ? data.data : data, // Handle both paginated and non-paginated structures
        pagination: data?.meta,
        isLoading: !error && !data,
        isError: error,
        mutate,
    };
}
