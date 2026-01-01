'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from '@/hooks/useCategories';
import { categoriesApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

export default function CategoriesPage() {
    const router = useRouter();
    const { categories, isLoading, mutate } = useCategories({ isActive: undefined, limit: 50 });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkLoading, setIsBulkLoading] = useState(false);

    const handleDelete = async (id: string, quoteCount: number) => {
        if (quoteCount > 0) {
            alert(`Cannot delete category with ${quoteCount} quotes. Please reassign or delete the quotes first.`);
            return;
        }

        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesApi.delete(id);
            mutate();
            alert('Category deleted successfully');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to delete category');
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} categories? This will only succeed if the categories have no quotes.`)) return;

        setIsBulkLoading(true);
        try {
            const res = await categoriesApi.bulkDelete(selectedIds);

            mutate();
            setSelectedIds([]);

            if (res.data?.data?.errors?.length > 0) {
                alert(`Operation completed with errors:\n${res.data.data.errors.join('\n')}`);
            } else {
                alert('Categories deleted successfully');
            }

        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to bulk delete categories');
        } finally {
            setIsBulkLoading(false);
        }
    };

    const columns = [
        {
            key: 'nameBn',
            label: 'Name (Bangla)',
            render: (value: string) => (
                <span className="font-bangla font-semibold">{value}</span>
            ),
        },
        {
            key: 'nameEn',
            label: 'Name (English)',
        },
        {
            key: 'slug',
            label: 'Slug',
            render: (value: string) => (
                <code className="px-2 py-1 bg-gray-100 rounded text-sm">{value}</code>
            ),
        },
        {
            key: '_count',
            label: 'Quotes',
            render: (value: any) => (
                <span className="font-medium">{formatNumber(value?.quotes || 0)}</span>
            ),
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
            key: 'order',
            label: 'Order',
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/categories/${row.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id, row._count?.quotes || 0)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600 mt-2">Manage quote categories & strategy</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => alert('Drag & Drop Reordering coming soon!')}>
                        Reorder Priority
                    </Button>
                    <Button onClick={() => router.push('/categories/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FolderOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Categories</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {categories?.length || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <FolderOpen className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Active</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {categories?.filter((c: any) => c.isActive).length || 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <FolderOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Quotes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {categories?.reduce((sum: number, c: any) => sum + (c._count?.quotes || 0), 0) || 0}
                            </p>
                        </div>
                    </div>
                </Card>
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
                    data={categories || []}
                    isLoading={isLoading}
                    emptyMessage="No categories found"
                    selectedIds={selectedIds}
                    onSelect={setSelectedIds}
                />
            </Card>
        </div>
    );
}
