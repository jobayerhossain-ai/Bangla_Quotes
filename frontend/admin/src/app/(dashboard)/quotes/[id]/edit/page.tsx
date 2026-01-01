'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { quotesApi } from '@/lib/api';
import { useQuote } from '@/hooks/useQuotes';
import { useCategories } from '@/hooks/useCategories';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const quoteSchema = z.object({
    textBn: z.string().min(10, 'Bangla text must be at least 10 characters'),
    textEn: z.string().optional(),
    author: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function EditQuotePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { quote, isLoading } = useQuote(params.id);
    const { categories } = useCategories({ isActive: true });

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
    });

    useEffect(() => {
        if (quote) {
            reset({
                textBn: quote.textBn,
                textEn: quote.textEn || '',
                author: quote.author || '',
                categoryId: quote.categoryId,
                status: quote.status,
            });
        }
    }, [quote, reset]);

    const onSubmit = async (data: QuoteFormData) => {
        setIsSubmitting(true);
        try {
            await quotesApi.update(params.id, data);
            alert('Quote updated successfully!');
            router.push('/quotes');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to update quote');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this quote?')) return;

        try {
            await quotesApi.delete(params.id);
            alert('Quote deleted successfully!');
            router.push('/quotes');
        } catch (error) {
            alert('Failed to delete quote');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
        );
    }

    const textBn = watch('textBn');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Quote</h1>
                        <p className="text-gray-600 mt-2">Update quote details</p>
                    </div>
                </div>
                <Button variant="danger" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Same form fields as Create page */}
                <Card title="Quote Details">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quote (Bangla) <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register('textBn')}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-bangla text-lg"
                            />
                            {errors.textBn && (
                                <p className="mt-1 text-sm text-red-600">{errors.textBn.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Quote (English)
                            </label>
                            <textarea
                                {...register('textEn')}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>

                        <Input label="Author" {...register('author')} />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('categoryId')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                {categories?.map((cat: any) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nameBn} ({cat.nameEn})
                                    </option>
                                ))}
                            </select>
                            {errors.categoryId && (
                                <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status
                            </label>
                            <select
                                {...register('status')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="REVIEW">For Review</option>
                                <option value="PUBLISHED">Published</option>
                                <option value="ARCHIVED">Archived</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Preview */}
                {textBn && (
                    <Card title="Preview">
                        <div className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                            <p className="font-bangla text-2xl text-gray-900 leading-relaxed">
                                {textBn}
                            </p>
                            {watch('author') && (
                                <p className="text-gray-600 mt-4">— {watch('author')}</p>
                            )}
                        </div>
                    </Card>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting}>
                        <Save className="w-4 h-4 mr-2" />
                        Update Quote
                    </Button>
                </div>
            </form>
        </div>
    );
}
