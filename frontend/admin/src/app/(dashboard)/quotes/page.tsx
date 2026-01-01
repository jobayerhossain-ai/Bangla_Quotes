'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuotes } from '@/hooks/useQuotes';
import { useCategories } from '@/hooks/useCategories';
import { quotesApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import { formatDate, formatNumber, truncate, getStatusVariant } from '@/lib/utils';
import { Plus, Search, Filter, Upload, Edit, Trash2, Download } from 'lucide-react';

export default function QuotesPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [categorySlug, setCategorySlug] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isBulkActionLoading, setIsBulkActionLoading] = useState(false);

    const { quotes, pagination, isLoading, mutate } = useQuotes({
        page,
        limit: 20,
        search,
        status: status || undefined,
        categorySlug: categorySlug || undefined,
    });

    const { categories } = useCategories();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this quote?')) return;

        try {
            await quotesApi.delete(id);
            mutate();
            alert('Quote deleted successfully');
        } catch (error) {
            alert('Failed to delete quote');
        }
    };

    const handleBulkStatus = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to update ${selectedIds.length} quotes to ${newStatus}?`)) return;

        setIsBulkActionLoading(true);
        try {
            await quotesApi.bulkUpdateStatus(selectedIds, newStatus);
            mutate();
            setSelectedIds([]);
            alert('Bulk update successful');
        } catch (error) {
            alert('Failed to update quotes');
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} quotes?`)) return;

        setIsBulkActionLoading(true);
        try {
            await quotesApi.bulkDelete(selectedIds);
            mutate();
            setSelectedIds([]);
            alert('Bulk delete successful');
        } catch (error) {
            alert('Failed to delete quotes');
        } finally {
            setIsBulkActionLoading(false);
        }
    };

    const columns = [
        {
            key: 'textBn',
            label: 'Quote (Bangla)',
            render: (value: string) => (
                <div className="max-w-md">
                    <p className="font-bangla">{truncate(value, 100)}</p>
                </div>
            ),
        },
        {
            key: 'author',
            label: 'Author',
            render: (value: string) => value || '—',
        },
        {
            key: 'category',
            label: 'Category',
            render: (value: any) => (
                <Badge variant="info">{value.nameEn}</Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (value: string) => (
                <Badge variant={getStatusVariant(value)}>{value}</Badge>
            ),
        },
        {
            key: 'views',
            label: 'Views',
            render: (value: number) => (
                <span className="text-gray-600 font-medium">{formatNumber(value)}</span>
            ),
        },
        {
            key: 'shares',
            label: 'Shares',
            render: (value: number) => (
                <span className="text-gray-600">{formatNumber(value)}</span>
            ),
        },
        {
            key: 'createdAt',
            label: 'Created',
            render: (value: string) => formatDate(value, 'PP'),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, row: any) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push(`/quotes/${row.id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(row.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    const handleExport = () => {
        if (!quotes || quotes.length === 0) {
            alert('No quotes to export');
            return;
        }

        try {
            const csvData = quotes.map((q: any) => ({
                ID: q.id,
                Bangla: `"${q.textBn?.replace(/"/g, '""') || ''}"`,
                English: `"${q.textEn?.replace(/"/g, '""') || ''}"`,
                Author: q.author || '',
                Category: q.category?.nameEn || '',
                Status: q.status,
                Views: q.views,
                Shares: q.shares,
                Date: new Date(q.createdAt).toLocaleDateString()
            }));

            const headers = Object.keys(csvData[0]).join(',');
            const rows = csvData.map((row: any) => Object.values(row).join(',')).join('\n');
            const csv = `\uFEFF${headers}\n${rows}`; // Add BOM for Excel support

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `quotes_export_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export quotes');
        }
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
                    <p className="text-gray-600 mt-2">Manage all quotes</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleExport}
                        title="Export filtered quotes to CSV"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push('/quotes/bulk')}
                    >
                        <Upload className="w-4 h-4 mr-2" />
                        Bulk Upload
                    </Button>
                    <Button onClick={() => router.push('/quotes/new')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Quote
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search quotes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="REVIEW">For Review</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="ARCHIVED">Archived</option>
                    </select>

                    <select
                        value={categorySlug}
                        onChange={(e) => setCategorySlug(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="">All Categories</option>
                        {categories?.map((cat: any) => (
                            <option key={cat.id} value={cat.slug}>
                                {cat.nameEn}
                            </option>
                        ))}
                    </select>

                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearch('');
                            setStatus('');
                            setCategorySlug('');
                        }}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Clear Filters
                    </Button>
                </div>
            </Card>

            {/* Bulk Actions Bar */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 z-50 animate-in slide-in-from-bottom-5">
                    <span className="font-medium">{selectedIds.length} selected</span>
                    <div className="h-4 w-px bg-gray-700" />
                    <div className="flex items-center gap-2">
                        {status !== 'PUBLISHED' && (
                            <button
                                onClick={() => handleBulkStatus('PUBLISHED')}
                                disabled={isBulkActionLoading}
                                className="px-3 py-1.5 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors text-green-400"
                            >
                                Publish
                            </button>
                        )}
                        {status !== 'DRAFT' && (
                            <button
                                onClick={() => handleBulkStatus('DRAFT')}
                                disabled={isBulkActionLoading}
                                className="px-3 py-1.5 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors text-gray-300"
                            >
                                Draft
                            </button>
                        )}
                        {status !== 'ARCHIVED' && (
                            <button
                                onClick={() => handleBulkStatus('ARCHIVED')}
                                disabled={isBulkActionLoading}
                                className="px-3 py-1.5 hover:bg-gray-800 rounded-md text-sm font-medium transition-colors text-yellow-500"
                            >
                                Archive
                            </button>
                        )}
                        <button
                            onClick={handleBulkDelete}
                            disabled={isBulkActionLoading}
                            className="px-3 py-1.5 hover:bg-red-900/50 rounded-md text-sm font-medium transition-colors text-red-500"
                        >
                            Delete
                        </button>
                    </div>
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
                    data={quotes || []}
                    isLoading={isLoading}
                    emptyMessage="No quotes found"
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
