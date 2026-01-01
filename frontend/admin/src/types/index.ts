export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface Quote {
    id: string;
    textBn: string;
    textEn?: string;
    author?: string;
    categoryId: string;
    category: Category;
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    views: number;
    shares: number;
    downloads: number;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    nameBn: string;
    nameEn: string;
    slug: string;
    description?: string;
    isActive: boolean;
    order: number;
    _count?: {
        quotes: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: {
        message: string;
        code: string;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}
