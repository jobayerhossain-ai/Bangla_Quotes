import { prisma } from '../lib/prisma';

export const activityLogService = {
    log: async (
        userId: string,
        action: string,
        entity: string,
        entityId?: string,
        details?: any,
        ipAddress?: string,
        userAgent?: string
    ) => {
        try {
            await prisma.activityLog.create({
                data: {
                    userId,
                    action,
                    entity,
                    entityId,
                    details,
                    ipAddress,
                    userAgent,
                },
            });
        } catch (error) {
            // Silently fail logging to avoid disrupting main flow
            console.error('Failed to create activity log', error);
        }
    },

    getRecentLogs: async (limit: number = 20) => {
        return prisma.activityLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    },
};
