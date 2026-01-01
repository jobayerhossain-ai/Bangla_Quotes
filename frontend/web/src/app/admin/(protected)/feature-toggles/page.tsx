'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { settingsApi } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Shield, Download, Share2, Droplet, Lock, DollarSign, Zap } from 'lucide-react';

export default function FeatureTogglesPage() {
    const { data, isLoading, mutate } = useSWR('feature-toggles', () => settingsApi.getFeatureToggles());
    const [updating, setUpdating] = useState<string | null>(null);

    const toggles = data?.data?.data || [];

    const handleToggle = async (key: string, currentValue: boolean) => {
        setUpdating(key);
        try {
            await settingsApi.updateFeatureToggle(key, !currentValue);
            mutate();
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to update toggle');
        } finally {
            setUpdating(null);
        }
    };

    const handleInitialize = async () => {
        if (!confirm('Initialize default feature toggles? This will create missing toggles.')) return;

        try {
            await settingsApi.initializeFeatureToggles();
            mutate();
            alert('Feature toggles initialized successfully');
        } catch (error: any) {
            alert(error.response?.data?.error?.message || 'Failed to initialize toggles');
        }
    };

    const getIcon = (key: string) => {
        const icons: Record<string, any> = {
            DOWNLOAD_ENABLED: Download,
            SHARE_ENABLED: Share2,
            WATERMARK_ENABLED: Droplet,
            LOGIN_REQUIRED: Lock,
            ADS_ENABLED: DollarSign,
            PREMIUM_FEATURES: Zap,
        };
        return icons[key] || Shield;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Feature Toggles</h1>
                    <p className="text-gray-600 mt-2">Control platform features and functionality</p>
                </div>
                <Button variant="outline" onClick={handleInitialize}>
                    Initialize Defaults
                </Button>
            </div>

            <Card>
                <div className="space-y-4">
                    {toggles.length === 0 ? (
                        <div className="text-center py-12">
                            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No feature toggles found</p>
                            <Button onClick={handleInitialize}>Initialize Defaults</Button>
                        </div>
                    ) : (
                        toggles.map((toggle: any) => {
                            const Icon = getIcon(toggle.key);
                            return (
                                <div
                                    key={toggle.key}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-200 transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-lg ${toggle.isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                                            <Icon className={`w-6 h-6 ${toggle.isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {toggle.key.replace(/_/g, ' ')}
                                            </h3>
                                            <p className="text-sm text-gray-500">{toggle.description || 'No description'}</p>
                                            {toggle.updatedBy && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Last updated by: {toggle.updatedBy}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={toggle.isEnabled}
                                            onChange={() => handleToggle(toggle.key, toggle.isEnabled)}
                                            disabled={updating === toggle.key}
                                            className="sr-only peer"
                                        />
                                        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>

            <Card title="⚠️ Important Notes">
                <div className="space-y-2 text-sm text-gray-600">
                    <p>• Feature toggles control core platform functionality</p>
                    <p>• Changes take effect immediately for all users</p>
                    <p>• Premium features require proper backend implementation</p>
                    <p>• Watermark settings affect downloaded images</p>
                    <p>• Login requirements may impact user experience</p>
                </div>
            </Card>
        </div>
    );
}
