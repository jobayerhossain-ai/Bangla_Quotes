/**
 * API Client
 * 
 * Axios instance configured for the Bangla Quotes API
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// API Methods
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),

    me: () => api.get('/auth/me'),

    logout: () => api.post('/auth/logout'),
};

export const quotesApi = {
    getAll: (params?: any) => api.get('/quotes', { params }),

    getById: (id: string) => api.get(`/quotes/${id}`),

    create: (data: any) => api.post('/quotes', data),

    update: (id: string, data: any) => api.put(`/quotes/${id}`, data),

    delete: (id: string) => api.delete(`/quotes/${id}`),

    bulkCreate: (quotes: any[]) => api.post('/quotes/bulk', { quotes }),

    getRandom: (categorySlug?: string) =>
        api.get('/quotes/random', { params: { categorySlug } }),

    getTrending: (limit?: number) =>
        api.get('/quotes/trending', { params: { limit } }),

    bulkUpdateStatus: (ids: string[], status: string) =>
        api.patch('/quotes/bulk/status', { ids, status }),

    bulkDelete: (ids: string[]) =>
        api.post('/quotes/bulk/delete', { ids }),
};

export const categoriesApi = {
    getAll: (params?: any) => api.get('/categories', { params }),

    getById: (id: string) => api.get(`/categories/id/${id}`),

    getBySlug: (slug: string) => api.get(`/categories/${slug}`),

    create: (data: any) => api.post('/categories', data),

    update: (id: string, data: any) => api.put(`/categories/${id}`, data),

    delete: (id: string) => api.delete(`/categories/${id}`),

    bulkDelete: (ids: string[]) =>
        api.post('/categories/bulk/delete', { ids }),

    getPopular: (limit?: number) =>
        api.get('/categories/popular', { params: { limit } }),
};

export const assetsApi = {
    getAll: (params?: any) => api.get('/assets', { params }),
    getById: (id: string) => api.get(`/assets/${id}`),
    create: (data: any) => api.post('/assets', data),
    update: (id: string, data: any) => api.put(`/assets/${id}`, data),
    delete: (id: string) => api.delete(`/assets/${id}`),
    bulkDelete: (ids: string[]) => api.post('/assets/bulk/delete', { ids }),
};

export const dashboardApi = {
    getStats: () => api.get('/dashboard/stats'),
};

export const activityLogApi = {
    getRecent: (limit?: number) =>
        api.get('/activity-logs', { params: { limit } }),
};

export const usersApi = {
    getAll: (params?: any) => api.get('/users', { params }),
    getById: (id: string) => api.get(`/users/${id}`),
    updateStatus: (id: string, isActive: boolean) =>
        api.patch(`/users/${id}/status`, { isActive }),
    updateRole: (id: string, role: string) =>
        api.patch(`/users/${id}/role`, { role }),
};

export const settingsApi = {
    getFeatureToggles: () => api.get('/settings/feature-toggles'),
    updateFeatureToggle: (key: string, isEnabled: boolean) =>
        api.patch(`/settings/feature-toggles/${key}`, { isEnabled }),
    initializeFeatureToggles: () => api.post('/settings/feature-toggles/init'),

    // General Settings
    getAll: (group?: string) => api.get('/settings', { params: { group } }),
    upsert: (data: { key: string; value: string; type?: string; group?: string; isPublic?: boolean; description?: string }) =>
        api.put('/settings', data),
};

export const uploadApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
