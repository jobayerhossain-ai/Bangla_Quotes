/**
 * Asset Service
 * 
 * Business logic for studio asset management.
 */

import { PrismaClient, StudioAsset, AssetType, Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { calculatePagination, PaginationMeta } from '../utils/response';
import { activityLogService } from './activityLog.service';

const prisma = new PrismaClient();

// ...
export interface CreateAssetDTO {
    type: AssetType;
    name: string;
    value: string; // URL for images/fonts, CSS string for gradients
    preview?: string | null; // Allow null
    isPremium?: boolean;
    isActive?: boolean;
    order?: number;
    metadata?: any;
    userId?: string; // For activity logging
}

export interface UpdateAssetDTO {
    name?: string;
    value?: string;
    preview?: string | null;
    isPremium?: boolean;
    isActive?: boolean;
    order?: number;
    metadata?: any;
    userId?: string; // For activity logging
}

export class AssetService {
    /**
     * Create a new asset
     */
    async create(data: CreateAssetDTO): Promise<StudioAsset> {
        const asset = await prisma.studioAsset.create({
            data: {
                type: data.type,
                name: data.name,
                value: data.value,
                preview: data.preview,
                isPremium: data.isPremium ?? false,
                isActive: data.isActive ?? true,
                order: data.order ?? 0,
                metadata: data.metadata,
            },
        });

        // Log Activity
        if (data.userId) {
            await activityLogService.log(
                data.userId,
                'CREATE',
                'ASSET',
                asset.id,
                { type: asset.type, name: asset.name }
            );
        }

        return asset;
    }

    /**
     * Find all assets
     */
    async findAll(
        type?: AssetType,
        isActive?: boolean,
        isPremium?: boolean,
        sortBy: string = 'order',
        sortOrder: 'asc' | 'desc' = 'asc',
        page?: number,
        limit?: number
    ): Promise<{ assets: StudioAsset[]; pagination?: PaginationMeta }> {
        const where: Prisma.StudioAssetWhereInput = {};

        if (type) where.type = type;
        if (isActive !== undefined) where.isActive = isActive;
        if (isPremium !== undefined) where.isPremium = isPremium;

        if (page && limit) {
            const total = await prisma.studioAsset.count({ where });
            const pagination = calculatePagination(page, limit, total);

            const assets = await prisma.studioAsset.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            });

            return { assets, pagination };
        }

        const assets = await prisma.studioAsset.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
        });

        return { assets };
    }

    /**
     * Find asset by ID
     */
    async findById(id: string): Promise<StudioAsset> {
        const asset = await prisma.studioAsset.findUnique({
            where: { id },
        });

        if (!asset) {
            throw ApiError.notFound('Asset not found');
        }

        return asset;
    }

    /**
     * Update asset
     */
    async update(id: string, data: UpdateAssetDTO): Promise<StudioAsset> {
        const existing = await prisma.studioAsset.findUnique({ where: { id } });
        if (!existing) throw ApiError.notFound('Asset not found');

        const asset = await prisma.studioAsset.update({
            where: { id },
            data: {
                name: data.name,
                value: data.value,
                preview: data.preview,
                isPremium: data.isPremium,
                isActive: data.isActive,
                order: data.order,
                metadata: data.metadata,
            },
        });

        // Log Activity
        if (data.userId) {
            await activityLogService.log(
                data.userId,
                'UPDATE',
                'ASSET',
                asset.id,
                { changes: data }
            );
        }

        return asset;
    }

    /**
     * Delete asset
     */
    async delete(id: string, userId?: string): Promise<void> {
        const asset = await prisma.studioAsset.findUnique({ where: { id } });
        if (!asset) throw ApiError.notFound('Asset not found');

        await prisma.studioAsset.delete({ where: { id } });

        // Log Activity
        if (userId) {
            await activityLogService.log(
                userId,
                'DELETE',
                'ASSET',
                id,
                { name: asset.name, type: asset.type }
            );
        }
    }

    /**
     * Bulk Delete Assets
     */
    async bulkDelete(ids: string[], userId?: string): Promise<{ count: number }> {
        const result = await prisma.studioAsset.deleteMany({
            where: { id: { in: ids } },
        });

        // Log Activity
        if (userId) {
            await activityLogService.log(
                userId,
                'BULK_DELETE',
                'ASSET',
                undefined,
                { count: result.count, ids }
            );
        }

        return result;
    }
}

export const assetService = new AssetService();
