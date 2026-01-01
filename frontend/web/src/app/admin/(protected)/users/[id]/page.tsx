'use client';

import { useParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { usersApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Mail, Calendar, Heart, Activity as ActivityIcon, Shield } from 'lucide-react';

export default function UserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const { data, isLoading } = useSWR(
        userId ? `user-${userId}` : null,
        () => usersApi.getById(userId)
    );

    const user = data?.data?.data;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">User not found</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
                    <p className="text-sm text-gray-500">View user information and activity</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <Card className="lg:col-span-1">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                        <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Badge variant={user.isActive ? 'success' : 'danger'}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Badge variant="warning">{user.role.replace('_', ' ')}</Badge>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                            <div className="flex items-center justify-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Joined {formatDate(user.createdAt, 'PP')}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Stats & Activity */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-pink-100 rounded-lg">
                                    <Heart className="w-6 h-6 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Favorites</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {user._count?.favorites || 0}
                                    </p>
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <ActivityIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Activities</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {user._count?.activities || 0}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Favorite Quotes */}
                    <Card title="Recent Favorites">
                        <div className="space-y-3">
                            {user.favorites?.length > 0 ? (
                                user.favorites.map((fav: any) => (
                                    <div
                                        key={fav.id}
                                        className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <p className="font-bangla text-gray-900 line-clamp-2">
                                            {fav.quote.textBn}
                                        </p>
                                        {fav.quote.author && (
                                            <p className="text-xs text-gray-500 mt-1">— {fav.quote.author}</p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No favorites yet</p>
                            )}
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card title="Recent Activity">
                        <div className="space-y-2">
                            {user.activities?.length > 0 ? (
                                user.activities.slice(0, 5).map((activity: any) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ActivityIcon className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{activity.action}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(activity.createdAt, 'PP p')}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
