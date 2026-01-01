'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { assetsApi } from '@/lib/api';
import { useAsset } from '@/hooks/useAssets';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const assetSchema = z.object({
    type: z.enum(['BACKGROUND_IMAGE', 'BACKGROUND_GRADIENT', 'FONT', 'TEXTURE']),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    value: z.string().min(1, 'Value is required'),
    preview: z.string().optional(),
    isPremium: z.boolean(),
    isActive: z.boolean(),
    order: z.number().int().min(0),
});

type AssetFormData = z.infer<typeof assetSchema>;

export default function EditAssetPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { asset, isLoading } = useAsset(params.id);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<AssetFormData>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            isActive: true,
            isPremium: false,
            order: 0,
        },
    });

    useEffect(() => {
        if (asset) {
            reset({
                type: asset.type,
                name: asset.name,
                value: asset.value,
                preview: asset.preview || '',
                isPremium: asset.isPremium,
                isActive: asset.isActive,
                order: asset.order,
            });
        }
    }, [asset, reset]);

    const onSubmit = async (data: AssetFormData) => {
        setIsSubmitting(true);
        try {
            await assetsApi.update(params.id, data);
            alert('Asset updated successfully!');
            router.push('/assets');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to update asset');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this asset?')) return;

        try {
            await assetsApi.delete(params.id);
            alert('Asset deleted successfully!');
            router.push('/assets');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to delete asset');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
            </div>
        );
    }

    const type = watch('type');
    const value = watch('value');

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Asset</h1>
                        <p className="text-gray-600 mt-2">Update studio asset</p>
                    </div>
                </div>
                <Button variant="danger" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card title="Asset Details">
                    <div className="space-y-6">
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Asset Type
                            </label>
                            <select
                                {...register('type')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                                <option value="BACKGROUND_GRADIENT">Gradient</option>
                                <option value="BACKGROUND_IMAGE">Image (URL)</option>
                                <option value="FONT">Font</option>
                                <option value="TEXTURE">Texture</option>
                            </select>
                        </div>

                        {/* Name */}
                        <Input
                            label="Name"
                            {...register('name')}
                            error={errors.name?.message}
                            required
                        />

                        {/* Value */}
                        <div className="space-y-2">
                            <Input
                                label="Value (CSS class or URL)"
                                {...register('value')}
                                error={errors.value?.message}
                                required
                            />
                        </div>

                        {/* Order */}
                        <Input
                            label="Display Order"
                            type="number"
                            {...register('order', { valueAsNumber: true })}
                            error={errors.order?.message}
                        />

                        {/* Toggles */}
                        <div className="flex gap-8">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...register('isActive')}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Active
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    {...register('isPremium')}
                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Premium Asset
                                </label>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Preview */}
                {value && (type === 'BACKGROUND_GRADIENT' || type === 'BACKGROUND_IMAGE') && (
                    <Card title="Preview">
                        <div className="flex justify-center p-6 bg-gray-100 rounded-lg">
                            <div
                                className={`w-64 h-64 rounded-xl shadow-lg border border-gray-200 ${type === 'BACKGROUND_GRADIENT' ? value : ''
                                    }`}
                                style={
                                    type === 'BACKGROUND_IMAGE'
                                        ? { backgroundImage: `url(${value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                                        : {}
                                }
                            />
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
                        Update Asset
                    </Button>
                </div>
            </form>
        </div>
    );
}
