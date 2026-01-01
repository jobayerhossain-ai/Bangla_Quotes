'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { categoriesApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Save, ArrowLeft } from 'lucide-react';

export default function CategorySEOPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { data, isLoading } = useSWR(
        params.id ? `category-${params.id}` : null,
        () => categoriesApi.getById(params.id)
    );

    const category = data?.data?.data;
    const [formData, setFormData] = useState({
        seoTitle: '',
        seoDesc: '',
        priority: 0,
    });
    const [isSaving, setIsSaving] = useState(false);

    // Update form when data loads
    useState(() => {
        if (category) {
            setFormData({
                seoTitle: category.seoTitle || '',
                seoDesc: category.seoDesc || '',
                priority: category.priority || 0,
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await categoriesApi.update(params.id, formData);
            alert('SEO settings updated successfully');
            router.back();
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to update SEO settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
                    <p className="text-sm text-gray-500">{category?.nameBn} ({category?.nameEn})</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card title="Search Engine Optimization">
                    <div className="space-y-6">
                        <Input
                            label="SEO Title"
                            value={formData.seoTitle}
                            onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                            placeholder="e.g., Best Love Quotes in Bangla | Bangla Quotes"
                            helperText={`${formData.seoTitle.length}/60 characters (recommended)`}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SEO Description
                            </label>
                            <textarea
                                value={formData.seoDesc}
                                onChange={(e) => setFormData({ ...formData, seoDesc: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                placeholder="Write a compelling description for search engines..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {formData.seoDesc.length}/160 characters (recommended)
                            </p>
                        </div>

                        <Input
                            label="Priority Score"
                            type="number"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                            helperText="Higher priority = Better ranking on homepage"
                        />
                    </div>
                </Card>

                <Card title="Preview">
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="text-blue-600 text-lg font-medium mb-1">
                                {formData.seoTitle || category?.nameEn || 'Category Title'}
                            </h3>
                            <p className="text-green-700 text-xs mb-2">
                                https://banglaquotes.com/category/{category?.slug}
                            </p>
                            <p className="text-sm text-gray-600">
                                {formData.seoDesc || 'No description provided'}
                            </p>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        Save SEO Settings
                    </Button>
                </div>
            </form>
        </div>
    );
}
