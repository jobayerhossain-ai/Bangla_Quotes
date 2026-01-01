'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAssets } from '@/hooks/useAssets';
import { assetsApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { Plus, Trash2, Image, Type, Palette, Grip } from 'lucide-react';

export default function AssetsPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [type, setType] = useState<string>('BACKGROUND_IMAGE');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkLoading, setIsBulkLoading] = useState(false);

    const { assets, pagination, isLoading, mutate } = useAssets({
        page,
        limit: 20,
        type,
    });

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} assets?`)) return;

        setIsBulkLoading(true);
        try {
            await assetsApi.bulkDelete(selectedIds);
            mutate();
            setSelectedIds([]);
            alert('Assets deleted successfully');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to delete assets');
        } finally {
            setIsBulkLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;
        try {
            await assetsApi.delete(id);
            mutate();
        } catch (error) {
            alert('Failed to delete asset');
        }
    };

    const columns = [
        {
            key: 'preview',
            label: 'Preview',
            render: (_: string | null, row: any) => {
                if (row.type === 'BACKGROUND_IMAGE' || row.type === 'TEXTURE') {
                    return (
                        <div className="h-16 w-16 relative rounded overflow-hidden bg-gray-100 border border-gray-200">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={row.value}
                                alt={row.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/64x64?text=Error';
                                }}
                            />
                        </div>
                    );
                } else if (row.type === 'BACKGROUND_GRADIENT') {
                    return (
                        <div
                            className="h-16 w-16 rounded border border-gray-200"
                            style={{ background: row.value }}
                            title={row.value}
                        />
                    );
                } else if (row.type === 'FONT') {
                    return (
                        <div className="h-16 w-16 flex items-center justify-center bg-gray-50 rounded border border-gray-200 text-2xl font-bold text-gray-400">
                            Aa
                        </div>
                    );
                }
                return null;
            }
        },
        {
            key: 'name',
            label: 'Name',
            render: (value: string) => <span className="font-medium text-gray-900">{value}</span>
        },
        {
            key: 'isPremium',
            label: 'Type',
            render: (value: boolean) => value ? <Badge variant="warning">Premium</Badge> : <Badge variant="success">Free</Badge>
        },
        {
            key: 'isActive',
            label: 'Status',
            render: (value: boolean) => value ? <Badge variant="success">Active</Badge> : <Badge variant="danger">Inactive</Badge>
        },
        {
            key: '_count',
            label: 'Usage',
            render: (value: any) => <span className="text-gray-600">{formatNumber(value?.usage || 0)}</span>
        },
        {
            key: 'order',
            label: 'Order',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    {/* Add Edit button later */}
                </div>
            )
        }
    ];

    const tabs = [
        { id: 'BACKGROUND_IMAGE', label: 'Images', icon: Image },
        { id: 'BACKGROUND_GRADIENT', label: 'Gradients', icon: Palette },
        { id: 'FONT', label: 'Fonts', icon: Type },
        { id: 'TEXTURE', label: 'Textures', icon: Grip },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Assets Library</h1>
                    <p className="text-gray-600 mt-2">Manage localized assets for the studio</p>
                </div>
                <Button onClick={() => router.push('/assets/new')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                </Button>
            </div>

            {/* Type Tabs */}
            <div className="flex space-x-1 rounded-xl bg-gray-100 p-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = type === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setType(tab.id);
                                setPage(1);
                                setSelectedIds([]);
                            }}
                            className={`
                                w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2
                                ${isActive
                                    ? 'bg-white text-blue-700 shadow'
                                    : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-600'
                                }
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Bulk Actions Floating Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
                    <span className="font-medium">{selectedIds.length} selected</span>
                    <div className="h-4 w-px bg-gray-700" />
                    <button
                        onClick={handleBulkDelete}
                        disabled={isBulkLoading}
                        className="px-3 py-1.5 hover:bg-red-900/50 rounded-md text-sm font-medium transition-colors text-red-500 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Selected
                    </button>
                    <div className="h-4 w-px bg-gray-700" />
                    <button
                        onClick={() => setSelectedIds([])}
                        className="p-1 hover:bg-gray-800 rounded-full"
                    >
                        <span className="sr-only">Close</span>
                        x
                    </button>
                </div>
            )}

            {/* Table */}
            <Card>
                <Table
                    columns={columns}
                    data={assets || []}
                    isLoading={isLoading}
                    emptyMessage={`No ${type.toLowerCase().replace('_', ' ')}s found`}
                    selectedIds={selectedIds}
                    onSelect={setSelectedIds}
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
                                disabled={!pagination.hasPrev}
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
                                disabled={!pagination.hasNext}
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
