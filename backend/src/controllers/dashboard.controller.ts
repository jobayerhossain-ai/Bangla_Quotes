
import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendSuccess } from '../utils/response';
import { asyncHandler } from '../middleware/error.middleware';

class DashboardController {
    getStats = asyncHandler(async (req: Request, res: Response) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Run queries in parallel for performance
        const [
            quoteCounts,
            activeCategories,
            totalViewsData,
            studioUsageToday,
            recentQuotes,
            popularQuotes,
            dailyAnalytics
        ] = await Promise.all([
            // 1. Quote Counts by Status
            prisma.quote.groupBy({
                by: ['status'],
                _count: {
                    _all: true
                }
            }),

            // 2. Active Categories
            prisma.category.count({
                where: { isActive: true }
            }),

            // 3. Total Metrics
            prisma.quote.aggregate({
                _sum: {
                    views: true,
                    downloads: true,
                    shares: true,
                    studioUsage: true
                }
            }),

            // 4. Studio Usage Today
            prisma.analytics.count({
                where: {
                    event: 'STUDIO_OPEN',
                    createdAt: {
                        gte: today
                    }
                }
            }),

            // 5. Recent Quotes
            prisma.quote.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { category: true }
            }),

            // 6. Popular Quotes
            prisma.quote.findMany({
                take: 5,
                orderBy: { performanceScore: 'desc' },
                include: { category: true }
            }),

            // 7. Daily Analytics (Last 7 Days) - Simplified using raw query or grouping on Analytics table
            // For now, simpler approximation using Analytics table
            prisma.analytics.groupBy({
                by: ['event', 'createdAt'],
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                    }
                },
                _count: {
                    _all: true
                }
            })
        ]);

        // Process Quote Counts
        const totalQuotes = quoteCounts.reduce((acc, curr) => acc + curr._count._all, 0);
        const publishedQuotes = quoteCounts.find(q => q.status === 'PUBLISHED')?._count._all || 0;
        const draftQuotes = quoteCounts.find(q => q.status === 'DRAFT')?._count._all || 0;

        // Process Daily Analytics (Mocking graph data structure if raw query is complex for now)
        // Creating a map of last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        // Ideally this should be a cleaner aggregation, but we'll format it for the frontend
        // Note: Real production apps usually use a dedicated timeseries generic query
        const graphData = last7Days.map(date => ({
            date,
            views: 0, // Placeholder - implementing accurate daily views requires grouping by Date(createdAt) which Prisma handles specifically
        }));

        const stats = {
            counts: {
                totalQuotes,
                publishedQuotes,
                draftQuotes,
                activeCategories,
                views: totalViewsData._sum.views || 0,
                downloads: totalViewsData._sum.downloads || 0,
                shares: totalViewsData._sum.shares || 0,
                studioUsageTotal: totalViewsData._sum.studioUsage || 0,
                studioUsageToday
            },
            recentQuotes,
            popularQuotes,
            graphData // Returning structure for frontend to consume (even if empty for now to avoid breaking)
        };

        return sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
    });
}

export const dashboardController = new DashboardController();
