'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { assetsApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save } from 'lucide-react';

const assetSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    type: z.enum(['BACKGROUND_IMAGE', 'BACKGROUND_GRADIENT', 'FONT', 'TEXTURE']),
    value: z.string().min(1, 'Value is required'),
    preview: z.string().optional(),
    isPremium: z.boolean().default(false),
    isActive: z.boolean().default(true),
    order: z.number().int().default(0),
});

type AssetForm = z.infer<typeof assetSchema>;

export default function CreateAssetPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AssetForm>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            isPremium: false,
            isActive: true,
            order: 0,
            type: 'BACKGROUND_IMAGE'
        },
    });

    const type = watch('type');

    const onSubmit = async (data: AssetForm) => {
        setIsSubmitting(true);
        try {
            await assetsApi.create(data);
            alert('Asset created successfully');
            router.push('/assets');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to create asset');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Asset</h1>
                    <p className="text-gray-600">Create a new asset for the studio</p>
                </div>
            </div>

            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-700">Asset Type</label>
                        <select
                            {...register('type')}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="BACKGROUND_IMAGE">Background Image</option>
                            <option value="BACKGROUND_GRADIENT">Gradient</option>
                            <option value="FONT">Font</option>
                            <option value="TEXTURE">Texture</option>
                        </select>
                        {errors.type && (
                            <p className="text-sm text-red-600">{errors.type.message}</p>
                        )}
                    </div>

                    <Input
                        label="Name"
                        {...register('name')}
                        error={errors.name?.message}
                        placeholder="e.g., Sunset Vibes"
                    />

                    <div>
                        <Input
                            label={type === 'BACKGROUND_GRADIENT' ? "Gradient CSS Value" : "File URL"}
                            {...register('value')}
                            error={errors.value?.message}
                            placeholder={type === 'BACKGROUND_GRADIENT' ? "linear-gradient(to right, #ff0099, #493240)" : "https://example.com/image.png"}
                        />
                        {type === 'BACKGROUND_GRADIENT' && (
                            <p className="text-xs text-gray-500 mt-1">
                                Enter valid CSS background property value.
                            </p>
                        )}
                    </div>


                    <Input
                        label="Preview URL (Optional)"
                        {...register('preview')}
                        error={errors.preview?.message}
                        placeholder="Optional thumbnail URL"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Order"
                            type="number"
                            {...register('order', { valueAsNumber: true })}
                            error={errors.order?.message}
                        />

                        <div className="flex items-center gap-2 pt-8">
                            <input
                                type="checkbox"
                                id="isPremium"
                                {...register('isPremium')}
                                className="rounded text-primary-600 focus:ring-primary-500 h-4 w-4"
                            />
                            <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">Premium Asset</label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSubmitting ? 'Creating...' : 'Create Asset'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
