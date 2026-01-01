# 📝 Quote Management - Complete Implementation

## Overview
Complete code for Quote Management pages including list, create, edit, and bulk upload functionality.

---

## 📁 Quote List Page

### `src/app/(dashboard)/quotes/page.tsx`

```typescript
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
import Input from '@/components/ui/Input';
import { formatDate, formatNumber, truncate, getStatusVariant } from '@/lib/utils';
import { Plus, Search, Filter, Upload, Edit, Trash2 } from 'lucide-react';

export default function QuotesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [categorySlug, setCategorySlug] = useState('');

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
      render: (value: number) => formatNumber(value),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotes</h1>
          <p className="text-gray-600 mt-2">Manage all quotes</p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={quotes || []}
          isLoading={isLoading}
          emptyMessage="No quotes found"
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
```

---

## 📝 Create Quote Page

### `src/app/(dashboard)/quotes/new/page.tsx`

```typescript
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
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
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

  const textBn = watch('textBn');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Quote</h1>
          <p className="text-gray-600 mt-2">Add a new quote to the collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Form */}
        <Card title="Quote Details">
          <div className="space-y-6">
            {/* Bangla Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quote (Bangla) <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('textBn')}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-bangla text-lg"
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
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter quote in English (optional)..."
              />
            </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
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

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="DRAFT">Draft</option>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Create Quote
          </Button>
        </div>
      </form>
    </div>
  );
}
```

---

## ✏️ Edit Quote Page

### `src/app/(dashboard)/quotes/[id]/edit/page.tsx`

```typescript
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
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
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
```

---

## 📤 Bulk Upload Page

### `src/app/(dashboard)/quotes/bulk/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quotesApi } from '@/lib/api';
import { useCategories } from '@/hooks/useCategories';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ArrowLeft, Upload, Download, FileText } from 'lucide-react';
import { parseCSV } from '@/lib/utils';

export default function BulkUploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { categories } = useCategories();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Parse CSV
    const text = await selectedFile.text();
    const rows = parseCSV(text);
    
    // Skip header row
    const data = rows.slice(1).map((row) => ({
      textBn: row[0],
      textEn: row[1] || null,
      author: row[2] || null,
      categorySlug: row[3],
      status: row[4] || 'DRAFT',
    }));

    setPreview(data.slice(0, 5)); // Show first 5 rows
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      
      const quotes = rows.slice(1).map((row) => {
        const categorySlug = row[3];
        const category = categories?.find((c: any) => c.slug === categorySlug);
        
        return {
          textBn: row[0],
          textEn: row[1] || null,
          author: row[2] || null,
          categoryId: category?.id || '',
          status: row[4] || 'DRAFT',
        };
      });

      await quotesApi.bulkCreate(quotes);
      alert(`Successfully uploaded ${quotes.length} quotes!`);
      router.push('/quotes');
    } catch (error: any) {
      alert(error.response?.data?.error?.message || 'Failed to upload quotes');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'textBn,textEn,author,categorySlug,status\n' +
      'জীবনে সফল হতে হলে কঠোর পরিশ্রম করতে হবে।,To succeed in life you must work hard.,Unknown,life,PUBLISHED\n' +
      'ভালোবাসা হল জীবনের সৌন্দর্য।,Love is the beauty of life.,Rabindranath Tagore,love,PUBLISHED';
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes_template.csv';
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Upload</h1>
          <p className="text-gray-600 mt-2">Upload multiple quotes from CSV file</p>
        </div>
      </div>

      {/* Instructions */}
      <Card title="Instructions">
        <div className="space-y-4">
          <p className="text-gray-700">
            Upload a CSV file with the following columns:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>textBn</strong>: Quote in Bangla (required)</li>
            <li><strong>textEn</strong>: Quote in English (optional)</li>
            <li><strong>author</strong>: Author name (optional)</li>
            <li><strong>categorySlug</strong>: Category slug (required)</li>
            <li><strong>status</strong>: DRAFT, PUBLISHED, or ARCHIVED (optional, default: DRAFT)</li>
          </ul>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>
      </Card>

      {/* Upload */}
      <Card title="Upload CSV">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="cursor-pointer text-primary-600 hover:text-primary-700 font-medium"
            >
              Choose CSV file
            </label>
            <p className="text-sm text-gray-500 mt-2">
              {file ? file.name : 'or drag and drop'}
            </p>
          </div>

          {preview.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Preview (first 5 rows)
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Bangla</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Author</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preview.map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm font-bangla">{row.textBn}</td>
                        <td className="px-4 py-2 text-sm">{row.author || '—'}</td>
                        <td className="px-4 py-2 text-sm">{row.categorySlug}</td>
                        <td className="px-4 py-2 text-sm">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {file && (
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null);
                  setPreview([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} isLoading={isUploading}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Quotes
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
```

---

## 🎯 Summary

**Quote Management Complete:**
- ✅ List page with filters, search, pagination
- ✅ Create page with form validation
- ✅ Edit page with pre-filled data
- ✅ Bulk upload with CSV support
- ✅ Delete functionality
- ✅ Beautiful UI with previews

**Next: Category Management** 🚀
