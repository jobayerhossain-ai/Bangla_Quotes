'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { settingsApi, uploadApi } from '@/lib/api';
import { Save, Upload, Copy, Check, Image as ImageIcon, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

interface Setting {
    key: string;
    value: string;
    type: string;
    group: string;
    description?: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<Record<string, Setting>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Default settings configuration
    const defaultSettings = [
        { key: 'site_logo', label: 'Site Logo', group: 'appearance', type: 'image', description: 'Main logo shown in header. Recommended size: 200x50px' },
        { key: 'site_favicon', label: 'Favicon', group: 'appearance', type: 'image', description: 'Browser tab icon. Recommended size: 32x32px or 16x16px (ico/png)' },
        { key: 'meta_image', label: 'Meta SEO Image', group: 'seo', type: 'image', description: 'Default image for SEO meta tags when sharing links.' },
        { key: 'social_share_image', label: 'Social Share Preview', group: 'seo', type: 'image', description: 'Large image shown when sharing on Facebook/Twitter.' },
    ];

    useEffect(() => {
        fetchSettings();
    }, []);

    // Auto-dismiss notification
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const fetchSettings = async () => {
        try {
            const res = await settingsApi.getAll();
            const settingsMap = res.data.data.reduce((acc: any, curr: Setting) => {
                acc[curr.key] = curr;
                return acc;
            }, {});
            setSettings(settingsMap);
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            showNotification('Failed to load settings', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({ message, type });
    };

    const handleFileUpload = async (key: string, file: File) => {
        setUploading(key);
        try {
            // 1. Upload file
            const uploadRes = await uploadApi.upload(file);
            const fileUrl = uploadRes.data.data.url;

            // 2. Update setting
            const settingConfig = defaultSettings.find(s => s.key === key);
            await settingsApi.upsert({
                key,
                value: fileUrl,
                type: 'image',
                group: settingConfig?.group || 'general',
                isPublic: true,
                description: settingConfig?.description
            });

            // 3. Refresh local state
            setSettings(prev => ({
                ...prev,
                [key]: {
                    key,
                    value: fileUrl,
                    type: 'image',
                    group: settingConfig?.group || 'general',
                    description: settingConfig?.description
                }
            }));

            showNotification('Image uploaded and setting updated successfully!', 'success');
        } catch (error) {
            console.error('Upload failed:', error);
            showNotification('Failed to upload image. Please try again.', 'error');
        } finally {
            setUploading(null);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        showNotification('URL copied to clipboard', 'success');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-3 text-gray-500">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                    <p>Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-10">
            {/* Header with Notification */}
            <div className="relative">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold font-bangla text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            General Settings
                        </h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            Manage site branding and assets <Sparkles className="w-4 h-4 text-yellow-500" />
                        </p>
                    </div>
                </div>

                {/* Floating Notification */}
                {notification && (
                    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in transition-all ${notification.type === 'success'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                            : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                        }`}>
                        {notification.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{notification.message}</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {defaultSettings.map((config) => {
                    const currentSetting = settings[config.key];
                    const hasValue = currentSetting?.value;
                    const isUploading = uploading === config.key;

                    return (
                        <Card key={config.key} className="overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="p-6 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg text-gray-900">{config.label}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{config.description}</p>
                                    </div>
                                    {hasValue && (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Active
                                        </span>
                                    )}
                                </div>

                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 transition-all duration-300 ${isUploading ? 'bg-primary-50 border-primary-200' : 'bg-gray-50/50 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {hasValue ? (
                                        <div className="relative group w-full h-[180px] flex items-center justify-center">
                                            {/* Checkerboard background for transparency */}
                                            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/practicaldev/image/fetch/s--Rxj6QkE0--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/1wwdyw5de8avrdkgtz5n.png')] opacity-10 rounded-lg pointer-events-none" />

                                            <img
                                                src={currentSetting.value}
                                                alt={config.label}
                                                className="max-h-full max-w-full object-contain relative z-10 shadow-sm transition-transform duration-300 group-hover:scale-105"
                                            />

                                            <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 rounded-lg backdrop-blur-sm">
                                                <button
                                                    onClick={() => copyToClipboard(currentSetting.value)}
                                                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                                                    title="Copy URL"
                                                >
                                                    <Copy className="w-5 h-5" />
                                                </button>
                                                <a
                                                    href={currentSetting.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                                                    title="View Full Size"
                                                >
                                                    <ImageIcon className="w-5 h-5" />
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400 py-6">
                                            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                                                <ImageIcon className="w-8 h-8 opacity-40" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-500">No image uploaded</p>
                                            <p className="text-xs text-gray-400 mt-1">Upload a {config.type} to get started</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <label className="block w-full">
                                        <div className={`
                                            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer shadow-sm
                                            ${isUploading
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md active:scale-[0.99]'}
                                        `}>
                                            {isUploading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Uploading...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4" />
                                                    {hasValue ? 'Replace Image' : 'Upload Image'}
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) handleFileUpload(config.key, file);
                                            }}
                                            disabled={isUploading}
                                        />
                                    </label>

                                    {hasValue && (
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                                <span className="text-xs font-mono">URL</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={currentSetting.value}
                                                readOnly
                                                className="w-full pl-12 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all cursor-text truncate"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
