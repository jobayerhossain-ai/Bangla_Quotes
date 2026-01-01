/**
 * Application Constants
 */

export const APP_NAME = 'Bangla Quotes Admin';
export const APP_VERSION = '1.0.0';

export const QUOTE_STATUS = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED',
} as const;

export const QUOTE_STATUS_OPTIONS = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'ARCHIVED', label: 'Archived' },
];

export const SORT_OPTIONS = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'views', label: 'Views' },
    { value: 'shares', label: 'Shares' },
    { value: 'downloads', label: 'Downloads' },
];

export const SORT_ORDER_OPTIONS = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
];

export const PAGINATION_LIMITS = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 20;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/',
    QUOTES: '/quotes',
    QUOTES_NEW: '/quotes/new',
    QUOTES_EDIT: (id: string) => `/quotes/${id}/edit`,
    QUOTES_BULK: '/quotes/bulk',
    CATEGORIES: '/categories',
    CATEGORIES_NEW: '/categories/new',
    CATEGORIES_EDIT: (id: string) => `/categories/${id}/edit`,
    SETTINGS: '/settings',
} as const;

export const SIDEBAR_ITEMS = [
    {
        label: 'Dashboard',
        href: ROUTES.DASHBOARD,
        icon: 'LayoutDashboard',
    },
    {
        label: 'Quotes',
        href: ROUTES.QUOTES,
        icon: 'Quote',
    },
    {
        label: 'Categories',
        href: ROUTES.CATEGORIES,
        icon: 'FolderOpen',
    },
    {
        label: 'Settings',
        href: ROUTES.SETTINGS,
        icon: 'Settings',
    },
];

export const CHART_COLORS = {
    primary: '#0ea5e9',
    secondary: '#d946ef',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
};

export const TOAST_DURATION = 3000;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
];

export const CSV_HEADERS = [
    'textBn',
    'textEn',
    'author',
    'categorySlug',
    'status',
];
