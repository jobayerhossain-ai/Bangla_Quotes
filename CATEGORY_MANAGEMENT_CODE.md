# 📂 Category Management - Complete Implementation

## Overview
Complete code for Category Management pages including list, create, and edit functionality.

---

## 📁 Category List Page

### `src/app/(dashboard)/categories/page.tsx`

```typescript
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
  const { categories, isLoading, mutate } = useCategories({ isActive: undefined });

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-2">Manage quote categories</p>
        </div>
        <Button onClick={() => router.push('/categories/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
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

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={categories || []}
          isLoading={isLoading}
          emptyMessage="No categories found"
        />
      </Card>
    </div>
  );
}
```

---

## 📝 Create Category Page

### `src/app/(dashboard)/categories/new/page.tsx`

```typescript
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
```

---

## ✏️ Edit Category Page

### `src/app/(dashboard)/categories/[id]/edit/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoriesApi } from '@/lib/api';
import { useCategory } from '@/hooks/useCategories';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const categorySchema = z.object({
  nameBn: z.string().min(2, 'Bangla name must be at least 2 characters'),
  nameEn: z.string().min(2, 'English name must be at least 2 characters'),
  slug: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean(),
  order: z.number().int().min(0),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { category, isLoading } = useCategory(params.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        nameBn: category.nameBn,
        nameEn: category.nameEn,
        slug: category.slug,
        description: category.description || '',
        isActive: category.isActive,
        order: category.order,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await categoriesApi.update(params.id, data);
      alert('Category updated successfully!');
      router.push('/categories');
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const quoteCount = category?._count?.quotes || 0;
    
    if (quoteCount > 0) {
      alert(`Cannot delete category with ${quoteCount} quotes. Please reassign or delete the quotes first.`);
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoriesApi.delete(params.id);
      alert('Category deleted successfully!');
      router.push('/categories');
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to delete category');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
            <p className="text-gray-600 mt-2">
              {category?._count?.quotes || 0} quotes in this category
            </p>
          </div>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Same form fields as Create page */}
        <Card title="Category Details">
          <div className="space-y-6">
            <Input
              label="Name (Bangla)"
              {...register('nameBn')}
              error={errors.nameBn?.message}
              className="font-bangla"
              required
            />

            <Input
              label="Name (English)"
              {...register('nameEn')}
              error={errors.nameEn?.message}
              required
            />

            <Input
              label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
              helperText="Changing slug may break existing links"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <Input
              label="Display Order"
              type="number"
              {...register('order', { valueAsNumber: true })}
              error={errors.order?.message}
            />

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
            Update Category
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

## 🎯 Summary

**Category Management Complete:**
- ✅ List page with stats and table
- ✅ Create page with form validation
- ✅ Edit page with pre-filled data
- ✅ Delete functionality with quote count check
- ✅ Auto slug generation
- ✅ Beautiful UI with previews

**Admin Panel Status: 90% Complete!** 🎉

**Remaining:**
- Settings page (optional)
- Additional polish

**Ready for deployment!** 🚀
