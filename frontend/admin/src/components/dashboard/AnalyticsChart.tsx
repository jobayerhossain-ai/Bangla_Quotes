'use client';

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Card from '@/components/ui/Card';
import { useState } from 'react';

const data = [
    { name: 'Mon', views: 4000, shares: 2400 },
    { name: 'Tue', views: 3000, shares: 1398 },
    { name: 'Wed', views: 2000, shares: 9800 },
    { name: 'Thu', views: 2780, shares: 3908 },
    { name: 'Fri', views: 1890, shares: 4800 },
    { name: 'Sat', views: 2390, shares: 3800 },
    { name: 'Sun', views: 3490, shares: 4300 },
];

export default function AnalyticsChart() {
    const [duration, setDuration] = useState('7d');

    return (
        <Card>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Platform Growth</h3>
                    <p className="text-sm text-gray-500">Views & Engagement trends</p>
                </div>
                <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="text-sm border-gray-200 rounded-lg text-gray-600 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="7d">Last 7 Days</option>
                    <option value="30d">Last 30 Days</option>
                    <option value="90d">Last 3 Months</option>
                </select>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                            strokeWidth={3}
                        />
                        <Area
                            type="monotone"
                            dataKey="shares"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorShares)"
                            strokeWidth={3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
