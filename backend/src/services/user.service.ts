import { prisma } from '../lib/prisma';
import { Prisma, Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError';

export class UserService {
    /**
     * Get all users with pagination and filtering
     */
    async findAll(
        page: number = 1,
        limit: number = 10,
        search?: string,
        role?: Role,
        isActive?: boolean
    ) {
        const skip = (page - 1) * limit;

        const where: Prisma.UserWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        if (typeof isActive === 'boolean') {
            where.isActive = isActive;
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    createdAt: true,

                    _count: {
                        select: {
                            favorites: true,
                            activities: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            users,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get user by ID with detailed stats
     */
    async findById(id: string) {
        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        favorites: true,
                        activities: true,
                    }
                },
                favorites: {
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        quote: {
                            select: {
                                id: true,
                                textBn: true,
                                author: true
                            }
                        }
                    }
                },
                activities: {
                    take: 10,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            throw ApiError.notFound('User not found');
        }

        // Remove password
        const { password, ...rest } = user;
        return rest;
    }

    /**
     * Update user status (Block/Unblock)
     */
    async updateStatus(id: string, isActive: boolean) {
        // Prevent deactivating Super Admin if it's the last one, etc. (Optional logic)

        return prisma.user.update({
            where: { id },
            data: { isActive },
            select: { id: true, isActive: true }
        });
    }

    /**
     * Update user role
     */
    async updateRole(id: string, role: Role) {
        return prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, role: true }
        });
    }
}

export const userService = new UserService();
