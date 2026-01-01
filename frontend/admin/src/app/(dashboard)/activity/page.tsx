'use client';

import useSWR from 'swr';
import { activityLogApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Activity, User } from 'lucide-react';

export default function ActivityLogsPage() {
    const { data, isLoading } = useSWR('activity-logs', () => activityLogApi.getRecent(100));
    const logs = data?.data?.data || []; // Adjust based on actual API response structure (sendSuccess usually wraps in data object)

    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (_: any, row: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {row.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{row.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{row.user?.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'action',
            label: 'Action',
            render: (value: string) => (
                <Badge variant="outline" className="font-mono text-xs">
                    {value}
                </Badge>
            ),
        },
        {
            key: 'entity',
            label: 'Entity',
            render: (value: string, row: any) => (
                <div className="text-sm">
                    <span className="font-medium text-gray-700">{value}</span>
                    <span className="text-gray-400 mx-1">•</span>
                    <span className="text-xs text-gray-500 font-mono">{row.entityId?.substring(0, 8)}...</span>
                </div>
            ),
        },
        {
            key: 'details',
            label: 'Details',
            render: (value: any) => (
                <div className="max-w-xs text-xs text-gray-600 truncate">
                    {JSON.stringify(value)}
                </div>
            ),
        },
        {
            key: 'createdAt',
            label: 'Time',
            render: (value: string) => (
                <div className="text-sm text-gray-600">
                    {formatDate(value, 'PP p')}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
                    <p className="text-gray-600 mt-2">Track all administrative actions</p>
                </div>
                <Badge variant="warning" className="flex items-center gap-2 px-3 py-1">
                    <Activity className="w-4 h-4" />
                    Live Monitoring
                </Badge>
            </div>

            <Card>
                <Table
                    columns={columns}
                    data={logs}
                    isLoading={isLoading}
                    emptyMessage="No activity logs found"
                />
            </Card>
        </div>
    );
}
