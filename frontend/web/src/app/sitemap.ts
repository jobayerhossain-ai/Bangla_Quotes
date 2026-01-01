import { MetadataRoute } from 'next';
import { quotesApi, categoriesApi } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://banglaquotes.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        '',
        '/quotes',
        '/categories',
        '/studio',
        '/search',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes - Categories
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
        const { data: categories } = await categoriesApi.getAll();
        categoryRoutes = categories.data.map((cat: any) => ({
            url: `${BASE_URL}/categories/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Failed to generate category sitemap', error);
    }

    // Dynamic routes - Quotes (limit to recent 1000 for performance if massive)
    let quoteRoutes: MetadataRoute.Sitemap = [];
    try {
        const { data: quotes } = await quotesApi.getAll({ limit: 1000 });
        quoteRoutes = quotes.data.map((quote: any) => ({
            url: `${BASE_URL}/quotes/${quote.id}`,
            lastModified: new Date(quote.updatedAt || quote.createdAt),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Failed to generate quote sitemap', error);
    }

    return [...routes, ...categoryRoutes, ...quoteRoutes];
}
