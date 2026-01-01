'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { usersApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { User, Shield, Ban, CheckCircle } from 'lucide-react';

export default function UsersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [isActive, setIsActive] = useState<string>('');

    const { data, isLoading, mutate } = useSWR(
        ['users', page, search, role, isActive],
        () => usersApi.getAll({ page, limit: 20, search, role, isActive: isActive === '' ? undefined : isActive === 'true' })
    );

    const users = data?.data?.users || [];
    const pagination = data?.data?.meta;

    const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;

        try {
            await usersApi.updateStatus(userId, !currentStatus);
            mutate();
            alert('User status updated successfully');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to update user status');
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'User',
            render: (_: string, row: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold">
                        {row.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{row.name}</p>
                        <p className="text-sm text-gray-500">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: 'role',
            label: 'Role',
            render: (value: string) => {
                const roleColors: Record<string, string> = {
                    SUPER_ADMIN: 'danger',
                    CONTENT_MANAGER: 'warning',
                    MODERATOR: 'info',
                    ANALYST: 'success',
                    USER: 'outline',
                };
                return <Badge variant={roleColors[value] as any}>{value.replace('_', ' ')}</Badge>;
            },
        },
        {
            key: '_count',
            label: 'Favorites',
            render: (value: any) => <span className="text-gray-600">{value?.favorites || 0}</span>,
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (value: boolean) => (
                <Badge variant={value ? 'success' : 'danger'}>
                    {value ? 'Active' : 'Inactive'}
                </Badge>
            ),
        },
        {
            key: 'createdAt',
            label: 'Joined',
            render: (value: string) => formatDate(value, 'PP'),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/users/${row.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                    >
                        <User className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleStatusToggle(row.id, row.isActive)}
                        className={`p-2 rounded-lg transition-colors ${row.isActive
                                ? 'text-red-600 hover:bg-red-50'
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                        title={row.isActive ? 'Deactivate' : 'Activate'}
                    >
                        {row.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600 mt-2">Monitor and manage platform users</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Roles</option>
                        <option value="USER">User</option>
                        <option value="CONTENT_MANAGER">Content Manager</option>
                        <option value="MODERATOR">Moderator</option>
                        <option value="ANALYST">Analyst</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearch('');
                            setRole('');
                            setIsActive('');
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            </Card>

            {/* Table */}
            <Card>
                <Table
                    columns={columns}
                    data={users}
                    isLoading={isLoading}
                    emptyMessage="No users found"
                />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Showing {((page - 1) * pagination.limit) + 1} to{' '}
                            {Math.min(page * pagination.limit, pagination.total)} of{' '}
                            {pagination.total} results
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-gray-600">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                                disabled={page === pagination.totalPages}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
