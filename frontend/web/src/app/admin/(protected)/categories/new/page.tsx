'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoriesApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';

const categorySchema = z.object({
    nameBn: z.string().min(2, 'Bangla name must be at least 2 characters'),
    nameEn: z.string().min(2, 'English name must be at least 2 characters'),
    slug: z.string().optional(),
    description: z.string().optional(),
    isActive: z.boolean(),
    order: z.number().int().min(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            isActive: true,
            order: 0,
        },
    });

    const onSubmit = async (data: CategoryFormData) => {
        setIsSubmitting(true);
        try {
            await categoriesApi.create(data);
            alert('Category created successfully!');
            router.push('/categories');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to create category');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Category</h1>
                    <p className="text-gray-600 mt-2">Add a new quote category</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card title="Category Details">
                    <div className="space-y-6">
                        {/* Bangla Name */}
                        <Input
                            label="Name (Bangla)"
                            {...register('nameBn')}
                            error={errors.nameBn?.message}
                            placeholder="e.g., অনুপ্রেরণা"
                            className="font-bangla"
                            required
                        />

                        {/* English Name */}
                        <Input
                            label="Name (English)"
                            {...register('nameEn')}
                            error={errors.nameEn?.message}
                            placeholder="e.g., Inspiration"
                            required
                        />

                        {/* Slug */}
                        <Input
                            label="Slug"
                            {...register('slug')}
                            error={errors.slug?.message}
                            placeholder="e.g., inspiration (auto-generated if empty)"
                            helperText="Leave empty to auto-generate from Bangla name"
                        />

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="Brief description of the category..."
                            />
                        </div>

                        {/* Order */}
                        <Input
                            label="Display Order"
                            type="number"
                            {...register('order', { valueAsNumber: true })}
                            error={errors.order?.message}
                            placeholder="0"
                            helperText="Lower numbers appear first"
                        />

                        {/* Active Status */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <label className="text-sm font-medium text-gray-700">
                                Active (visible to users)
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Preview */}
                {watch('nameBn') && (
                    <Card title="Preview">
                        <div className="p-6 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg">
                            <h3 className="font-bangla text-2xl font-bold text-gray-900">
                                {watch('nameBn')}
                            </h3>
                            <p className="text-gray-700 mt-2">{watch('nameEn')}</p>
                            {watch('description') && (
                                <p className="text-gray-600 mt-4">{watch('description')}</p>
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
                        Create Category
                    </Button>
                </div>
            </form>
        </div>
    );
}
