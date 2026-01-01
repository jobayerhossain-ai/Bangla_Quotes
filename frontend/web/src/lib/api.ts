import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const quotesApi = {
    getAll: (params?: any) => api.get('/quotes', { params }),
    getById: (id: string) => api.get(`/quotes/${id}`),
    getRandom: (categorySlug?: string) =>
        api.get('/quotes/random', { params: { categorySlug } }),
    getTrending: (limit?: number) =>
        api.get('/quotes/trending', { params: { limit } }),
    incrementView: (id: string) => api.post(`/quotes/${id}/view`),
    incrementShare: (id: string) => api.post(`/quotes/${id}/share`),
    incrementDownload: (id: string) => api.post(`/quotes/${id}/download`),
};

export const categoriesApi = {
    getAll: (params?: any) => api.get('/categories', { params }),
    getBySlug: (slug: string) => api.get(`/categories/${slug}`),
    getPopular: (limit?: number) =>
        api.get('/categories/popular', { params: { limit } }),
    getQuotes: (slug: string, params?: any) =>
        api.get(`/categories/${slug}/quotes`, { params }),
};

export const assetsApi = {
    getAll: (params?: any) => api.get('/assets', { params }),
};
