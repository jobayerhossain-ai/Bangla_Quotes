'use client';

import useSWR from 'swr';
import { dashboardApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatNumber } from '@/lib/utils';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { TrendingUp, Quote, FolderOpen, Loader2, Image as ImageIcon, Activity, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { data: statsData, isLoading } = useSWR('dashboard-stats', () => dashboardApi.getStats());

    const counts = statsData?.data?.counts;

    const stats = [
        {
            label: 'Total Quotes',
            value: counts?.totalQuotes || 0,
            subValue: `${counts?.publishedQuotes || 0} Pub · ${counts?.draftQuotes || 0} Draft`,
            icon: Quote,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            label: 'Active Categories',
            value: counts?.activeCategories || 0,
            subValue: 'Total Categories', // Simplified for now
            icon: FolderOpen,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            label: 'Studio Usage (Today)',
            value: counts?.studioUsageToday || 0,
            subValue: `${formatNumber(counts?.studioUsageTotal || 0)} All Time`,
            icon: ImageIcon,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
        {
            label: 'Total Views',
            value: counts?.views || 0,
            subValue: `${formatNumber(counts?.shares || 0)} Shares`,
            icon: Activity,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
    ];

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
                    <p className="text-gray-600 mt-2">Platform Overview & Quick Actions</p>
                </div>
                <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                </div>
            </div>

            {/* Quick Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="hover:shadow-md transition-shadow border-l-4 border-l-primary-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {formatNumber(stat.value)}
                                    </p>
                                    {stat.subValue && (
                                        <p className="text-xs text-gray-500 mt-1 font-medium">
                                            {stat.subValue}
                                        </p>
                                    )}
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                                    <Icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Analytics & Trends Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <AnalyticsChart />
                </div>

                <div className="space-y-6">
                    {/* Quick Action Card */}
                    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
                        <div className="p-2">
                            <h3 className="text-xl font-bold mb-2">Create New Quote</h3>
                            <p className="text-gray-400 text-sm mb-6">Share wisdom with the world. Create a beautiful quote now.</p>
                            <Link
                                href="/quotes/new"
                                className="w-full bg-primary-600 hover:bg-primary-500 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <Quote className="w-4 h-4" />
                                Create Quote
                            </Link>
                        </div>
                    </Card>

                    {/* System Status */}
                    <Card title="System Health">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">API Status</span>
                                <Badge variant="success">Operational</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Database</span>
                                <Badge variant="success">Connected</Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Version</span>
                                <span className="text-gray-900 font-mono">v1.0.0</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Quotes (Actionable Data) */}
                <Card title="⭐️ Top Performing Quotes" subtitle="Based on view count">
                    <div className="space-y-4">
                        {statsData?.data?.popularQuotes?.map((quote: any, i: number) => (
                            <div
                                key={quote.id}
                                className="flex items-start justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all"
                            >
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full font-bold text-gray-500 text-sm">
                                        #{i + 1}
                                    </div>
                                    <div>
                                        <p className="font-bangla text-gray-900 line-clamp-2">{quote.textBn}</p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" /> {formatNumber(quote.views)}
                                            </span>
                                            <span>•</span>
                                            <span>{quote.category?.nameEn}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="success">Active</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Quotes (Review Queue) */}
                <Card title="📝 Recently Added" subtitle="Quotes needing review or just added">
                    <div className="space-y-4">
                        {statsData?.data?.recentQuotes?.map((quote: any) => (
                            <div
                                key={quote.id}
                                className="flex items-start justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-primary-200 hover:shadow-sm transition-all"
                            >
                                <div>
                                    <p className="font-bangla text-gray-900 line-clamp-2">{quote.textBn}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span>Added {new Date(quote.createdAt).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{quote.author || 'Unknown'}</span>
                                    </div>
                                </div>
                                <Badge variant={quote.status === 'PUBLISHED' ? 'success' : 'warning'}>
                                    {quote.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
