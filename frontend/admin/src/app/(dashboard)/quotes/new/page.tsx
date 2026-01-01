'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { quotesApi } from '@/lib/api';
import { useCategories } from '@/hooks/useCategories';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';

const quoteSchema = z.object({
    textBn: z.string().min(10, 'Bangla text must be at least 10 characters'),
    textEn: z.string().optional(),
    author: z.string().optional(),
    categoryId: z.string().min(1, 'Category is required'),
    status: z.enum(['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED']),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

export default function NewQuotePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { categories } = useCategories({ isActive: true });

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<QuoteFormData>({
        resolver: zodResolver(quoteSchema),
        defaultValues: {
            status: 'DRAFT',
        },
    });

    const onSubmit = async (data: QuoteFormData) => {
        setIsSubmitting(true);
        try {
            await quotesApi.create(data);
            alert('Quote created successfully!');
            router.push('/quotes');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to create quote');
        } finally {
            setIsSubmitting(false);
        }
    };

    const textBn = watch('textBn') || '';
    const author = watch('author');

    return (
        <div className="max-w-7xl mx-auto space-y-6 h-[calc(100vh-100px)]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Quote</h1>
                        <p className="text-sm text-gray-500">Drafting mode</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        isLoading={isSubmitting}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Quote
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Panel: Editor Form */}
                <div className="space-y-6 overflow-y-auto pr-2 pb-20">
                    <Card title="Content & Settings">
                        <div className="space-y-6">
                            {/* Bangla Text */}
                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Quote (Bangla) <span className="text-red-500">*</span></span>
                                    <span className={`text-xs ${textBn.length > 200 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {textBn.length} chars
                                    </span>
                                </label>
                                <textarea
                                    {...register('textBn')}
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent font-bangla text-lg shadow-sm"
                                    placeholder="বাংলায় উক্তি লিখুন..."
                                />
                                {errors.textBn && (
                                    <p className="mt-1 text-sm text-red-600">{errors.textBn.message}</p>
                                )}
                            </div>

                            {/* English Text */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quote (English)
                                </label>
                                <textarea
                                    {...register('textEn')}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm shadow-sm"
                                    placeholder="Enter quote in English (optional)..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Author */}
                                <Input
                                    label="Author"
                                    {...register('author')}
                                    placeholder="e.g., রবীন্দ্রনাথ ঠাকুর"
                                />

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        {...register('categoryId')}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select Category</option>
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
                            </div>

                            {/* Status and Visibility */}
                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Publishing Status
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {['DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED'].map((status) => (
                                        <label key={status} className={`
                                            cursor-pointer text-center py-2 rounded-lg border text-xs font-semibold transition-all
                                            ${watch('status') === status
                                                ? 'bg-primary-50 border-primary-500 text-primary-700 ring-1 ring-primary-500'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                                        `}>
                                            <input
                                                type="radio"
                                                value={status}
                                                {...register('status')}
                                                className="sr-only"
                                            />
                                            {status}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Live Studio Preview */}
                <div className="sticky top-6 h-fit space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Live Preview</h3>

                    {/* Phone/Card Preview Container */}
                    <div className="relative mx-auto border-gray-800 bg-gray-900 border-[8px] rounded-[2.5rem] h-[600px] w-[340px] shadow-xl overflow-hidden ring-1 ring-gray-900/5">
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8 text-center text-white relative">
                            {/* Content */}
                            <div className="z-10 relative">
                                <div className="mb-6 opacity-80">
                                    <svg className="w-8 h-8 mx-auto text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 16.6569 20.6739 18 19.017 18H16.017C15.4647 18 15.017 18.4477 15.017 19V21L14.017 21ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 16.6569 11.6735 18 10.0166 18H7.0166C6.46432 18 6.0166 18.4477 6.0166 19V21L5.0166 21Z" />
                                    </svg>
                                </div>

                                <h2 className="text-2xl font-bangla font-bold leading-normal mb-6 drop-shadow-md">
                                    {textBn || 'এখানে আপনার উক্তি প্রিভিউ দেখা যাবে...'}
                                </h2>

                                {author && (
                                    <p className="text-sm font-medium opacity-90 tracking-wide border-t border-white/30 inline-block pt-3 px-4">
                                        — {author}
                                    </p>
                                )}
                            </div>

                            {/* Decorative Blur Orbs */}
                            <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                            <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                        </div>
                    </div>

                    <div className="text-center text-xs text-gray-500">
                        This is an approximation of the user's view in Studio Mode.
                    </div>
                </div>
            </div>
        </div>
    );
}
