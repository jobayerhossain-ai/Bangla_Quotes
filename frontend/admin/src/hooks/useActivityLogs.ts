import useSWR from 'swr';
import { activityLogApi } from '@/lib/api';

export function useActivityLogs(limit: number = 20) {
    const { data, error, isLoading, mutate } = useSWR(
        ['activity-logs', limit],
        () => activityLogApi.getRecent(limit)
    );

    return {
        logs: data?.data?.data,
        isLoading,
        isError: error,
        mutate,
    };
}
