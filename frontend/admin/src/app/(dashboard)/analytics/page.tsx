'use client';

import useSWR from 'swr';
import { dashboardApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import { TrendingUp, Eye, Share2, Download } from 'lucide-react';

export default function AnalyticsPage() {
    const { data, isLoading } = useSWR('analytics-stats', () => dashboardApi.getStats());

    const stats = data?.data?.counts;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
                <p className="text-gray-600 mt-2">Platform performance metrics and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Views</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(stats?.views || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Share2 className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Shares</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(stats?.shares || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <Download className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Downloads</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(stats?.downloads || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-100 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Studio Usage</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(stats?.studioUsageTotal || 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Conversion Funnel */}
            <Card title="📊 Conversion Funnel">
                <div className="space-y-4">
                    {[
                        { label: 'Views', value: stats?.views || 0, color: 'bg-blue-500', width: '100%' },
                        { label: 'Studio Opens', value: stats?.studioUsageTotal || 0, color: 'bg-purple-500', width: '75%' },
                        { label: 'Shares', value: stats?.shares || 0, color: 'bg-green-500', width: '50%' },
                        { label: 'Downloads', value: stats?.downloads || 0, color: 'bg-orange-500', width: '30%' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">{item.label}</span>
                                <span className="text-gray-600">{item.value.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`${item.color} h-3 rounded-full transition-all`}
                                    style={{ width: item.width }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Growth Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="📈 Growth Trends">
                    <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Quote Growth</p>
                            <p className="text-3xl font-bold text-green-600">+{stats?.totalQuotes || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Total quotes in platform</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Category Expansion</p>
                            <p className="text-3xl font-bold text-blue-600">{stats?.activeCategories || 0}</p>
                            <p className="text-xs text-gray-500 mt-1">Active categories</p>
                        </div>
                    </div>
                </Card>

                <Card title="🎯 Performance Insights">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Avg. Views per Quote</span>
                            <span className="font-bold text-gray-900">
                                {stats?.totalQuotes > 0
                                    ? Math.round((stats?.views || 0) / stats.totalQuotes)
                                    : 0}
                            </span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Share Rate</span>
                            <span className="font-bold text-gray-900">
                                {stats?.views > 0
                                    ? ((stats?.shares || 0) / stats.views * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">Download Rate</span>
                            <span className="font-bold text-gray-900">
                                {stats?.views > 0
                                    ? ((stats?.downloads || 0) / stats.views * 100).toFixed(1)
                                    : 0}%
                            </span>
                        </div>
                    </div>
                </Card>
            </div>

            <Card title="💡 Recommendations">
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• Focus on categories with high engagement rates</p>
                    <p>• Optimize quotes with low view counts</p>
                    <p>• Promote studio features to increase downloads</p>
                    <p>• Monitor trending topics for content strategy</p>
                </div>
            </Card>
        </div>
    );
}
