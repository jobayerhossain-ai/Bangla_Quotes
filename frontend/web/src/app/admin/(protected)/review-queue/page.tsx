'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { quotesApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

export default function ReviewQueuePage() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data, isLoading, mutate } = useSWR(
        ['quotes-review', page],
        () => quotesApi.getAll({ page, limit: 20, status: 'REVIEW' })
    );

    const quotes = data?.data?.quotes || [];
    const pagination = data?.data?.pagination;

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this quote for publishing?')) return;

        try {
            await quotesApi.update(id, { status: 'PUBLISHED' });
            mutate();
            alert('Quote approved and published');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to approve quote');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Reason for rejection (optional):');

        try {
            await quotesApi.update(id, { status: 'DRAFT' });
            mutate();
            alert('Quote rejected and moved to draft');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to reject quote');
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
                    <p className="text-gray-600 mt-2">Content quality gate - Approve or reject quotes</p>
                </div>
                <Badge variant="warning" className="text-lg px-4 py-2">
                    {quotes.length} Pending
                </Badge>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : quotes.length === 0 ? (
                <Card>
                    <div className="text-center py-12">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                        <p className="text-gray-500">No quotes pending review</p>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {quotes.map((quote: any) => (
                        <Card key={quote.id}>
                            <div className="space-y-4">
                                {/* Quote Content */}
                                <div className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl">
                                    <p className="font-bangla text-2xl text-gray-900 leading-relaxed mb-4">
                                        {quote.textBn}
                                    </p>
                                    {quote.textEn && (
                                        <p className="text-gray-600 italic mb-4">
                                            "{quote.textEn}"
                                        </p>
                                    )}
                                    {quote.author && (
                                        <p className="text-gray-700 font-medium">
                                            — {quote.author}
                                        </p>
                                    )}
                                </div>

                                {/* Metadata */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Category:</span>{' '}
                                            <Badge variant="info">{quote.category?.nameEn}</Badge>
                                        </div>
                                        <div>
                                            <span className="font-medium">Submitted:</span>{' '}
                                            {formatDate(quote.createdAt, 'PP')}
                                        </div>
                                        {quote.lastModifiedBy && (
                                            <div>
                                                <span className="font-medium">By:</span> {quote.lastModifiedBy}
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/quotes/${quote.id}/edit`)}
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleReject(quote.id)}
                                            className="text-red-600 hover:bg-red-50 border-red-200"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleApprove(quote.id)}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <Button
                        variant="outline"
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
                        onClick={() => setPage(page + 1)}
                        disabled={!pagination.hasNext}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
