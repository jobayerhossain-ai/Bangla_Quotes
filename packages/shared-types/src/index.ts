/**
 * Core Type Definitions for Bangla Quotes Platform
 * 
 * This file contains all shared types used across the platform.
 * These types ensure consistency between frontend, backend, and database.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum QuoteStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export enum AssetType {
    BACKGROUND_IMAGE = 'BACKGROUND_IMAGE',
    BACKGROUND_GRADIENT = 'BACKGROUND_GRADIENT',
    FONT = 'FONT',
    TEXTURE = 'TEXTURE',
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum AnalyticsEvent {
    QUOTE_VIEW = 'QUOTE_VIEW',
    QUOTE_SHARE = 'QUOTE_SHARE',
    QUOTE_DOWNLOAD = 'QUOTE_DOWNLOAD',
    STUDIO_OPEN = 'STUDIO_OPEN',
    CATEGORY_VIEW = 'CATEGORY_VIEW',
}

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserWithoutPassword extends Omit<User, 'password'> { }

export interface CreateUserDTO {
    email: string;
    password: string;
    name: string;
    role?: UserRole;
}

export interface UpdateUserDTO {
    email?: string;
    name?: string;
    role?: UserRole;
    isActive?: boolean;
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: UserWithoutPassword;
    accessToken: string;
    refreshToken: string;
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
    id: string;
    nameBn: string;
    nameEn: string;
    slug: string;
    description?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CategoryWithQuoteCount extends Category {
    _count: {
        quotes: number;
    };
}

export interface CreateCategoryDTO {
    nameBn: string;
    nameEn: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    order?: number;
}

export interface UpdateCategoryDTO {
    nameBn?: string;
    nameEn?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    order?: number;
}

// ============================================================================
// QUOTE TYPES
// ============================================================================

export interface Quote {
    id: string;
    textBn: string;
    textEn?: string;
    author?: string;
    categoryId: string;
    status: QuoteStatus;
    views: number;
    shares: number;
    downloads: number;
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

export interface QuoteWithCategory extends Quote {
    category: Category;
}

export interface QuoteWithRelations extends Quote {
    category: Category;
    _count?: {
        favorites: number;
    };
}

export interface CreateQuoteDTO {
    textBn: string;
    textEn?: string;
    author?: string;
    categoryId: string;
    status?: QuoteStatus;
    publishedAt?: Date;
}

export interface UpdateQuoteDTO {
    textBn?: string;
    textEn?: string;
    author?: string;
    categoryId?: string;
    status?: QuoteStatus;
    publishedAt?: Date;
}

export interface BulkCreateQuoteDTO {
    quotes: CreateQuoteDTO[];
}

export interface QuoteFilters {
    categoryId?: string;
    categorySlug?: string;
    status?: QuoteStatus;
    search?: string;
    author?: string;
}

export interface QuoteSortOptions {
    field: 'createdAt' | 'views' | 'shares' | 'downloads' | 'updatedAt';
    order: 'asc' | 'desc';
}

// ============================================================================
// ASSET TYPES
// ============================================================================

export interface StudioAsset {
    id: string;
    type: AssetType;
    name: string;
    value: string;
    preview?: string;
    isPremium: boolean;
    isActive: boolean;
    order: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAssetDTO {
    type: AssetType;
    name: string;
    value: string;
    preview?: string;
    isPremium?: boolean;
    isActive?: boolean;
    order?: number;
    metadata?: Record<string, any>;
}

export interface UpdateAssetDTO {
    name?: string;
    value?: string;
    preview?: string;
    isPremium?: boolean;
    isActive?: boolean;
    order?: number;
    metadata?: Record<string, any>;
}

export interface AssetFilters {
    type?: AssetType;
    isPremium?: boolean;
    isActive?: boolean;
}

// ============================================================================
// FAVORITE TYPES
// ============================================================================

export interface Favorite {
    id: string;
    userId: string;
    quoteId: string;
    createdAt: Date;
}

export interface CreateFavoriteDTO {
    quoteId: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface Analytics {
    id: string;
    quoteId?: string;
    event: AnalyticsEvent;
    metadata?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

export interface CreateAnalyticsDTO {
    quoteId?: string;
    event: AnalyticsEvent;
    metadata?: Record<string, any>;
}

export interface DashboardStats {
    totalQuotes: number;
    totalCategories: number;
    totalAssets: number;
    totalViews: number;
    totalDownloads: number;
    totalShares: number;
    todayViews: number;
    todayDownloads: number;
    weeklyViews: number;
    weeklyDownloads: number;
    trendingQuotes: QuoteWithCategory[];
    recentQuotes: QuoteWithCategory[];
    popularCategories: CategoryWithQuoteCount[];
}

// ============================================================================
// STUDIO TYPES
// ============================================================================

export interface GradientConfig {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
    positions?: number[];
}

export interface BackgroundConfig {
    type: 'color' | 'gradient' | 'image';
    value: string | GradientConfig;
}

export interface TextConfig {
    content: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    align: 'left' | 'center' | 'right';
    lineHeight: number;
    maxWidth: number;
}

export interface PaddingConfig {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export interface CanvasConfig {
    width: number;
    height: number;
    exportScale: number;
}

export interface StudioConfig {
    canvas: CanvasConfig;
    text: TextConfig;
    background: BackgroundConfig;
    padding: PaddingConfig;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    timestamp: string;
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: Array<{
            field: string;
            message: string;
        }>;
    };
    timestamp: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    cursor?: string;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextCursor?: string;
    prevCursor?: string;
}

export interface PaginatedResponse<T> {
    success: true;
    data: T[];
    pagination: PaginationMeta;
    timestamp: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type WithoutTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'>;
export type WithTimestamps<T> = T & {
    createdAt: Date;
    updatedAt: Date;
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// ============================================================================
// VALIDATION SCHEMAS (for reference - actual validation uses Zod)
// ============================================================================

export interface ValidationError {
    field: string;
    message: string;
    value?: any;
}

export interface ValidationResult {
    valid: boolean;
    errors?: ValidationError[];
}
