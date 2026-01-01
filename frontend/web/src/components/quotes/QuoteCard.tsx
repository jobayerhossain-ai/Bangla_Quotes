'use client';

import Link from 'next/link';
import { Share2, Download, Heart, Eye, Copy, Check } from 'lucide-react';
import {
    shareOnFacebook,
    shareOnTwitter,
    shareOnWhatsApp,
    downloadAsImage,
    cn
} from '@/lib/utils';
import { quotesApi } from '@/lib/api';
import { useState, useRef } from 'react';

interface QuoteCardProps {
    quote: any;
    priority?: boolean;
}

export default function QuoteCard({ quote, priority = false }: QuoteCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current || isDownloading) return;
        setIsDownloading(true);
        await downloadAsImage(cardRef.current, `bangla-quote-${quote.id}.png`);
        await quotesApi.incrementDownload(quote.id);
        setIsDownloading(false);
    };

    const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp') => {
        const url = `${window.location.origin}/quotes/${quote.id}`;
        const text = quote.textBn;

        switch (platform) {
            case 'facebook':
                shareOnFacebook(url);
                break;
            case 'twitter':
                shareOnTwitter(text, url);
                break;
            case 'whatsapp':
                shareOnWhatsApp(`${text}\n\n${url}`);
                break;
        }
        await quotesApi.incrementShare(quote.id);
        setShowShareMenu(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(quote.textBn);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Quote Content Area - Capture target for image */}
            <div
                ref={cardRef}
                className="p-8 bg-gradient-to-br from-white to-gray-50 text-center relative min-h-[300px] flex flex-col justify-center items-center"
            >
                <div className="absolute top-4 left-4 text-6xl font-serif text-primary-100 select-none">"</div>
                <Link href={`/quotes/${quote.id}`} className="block relative z-10 w-full">
                    <p className="text-xl md:text-2xl font-bangla text-gray-800 leading-relaxed mb-6">
                        {quote.textBn}
                    </p>
                </Link>
                <div className="relative z-10">
                    <Link
                        href={`/categories/${quote.category.slug}`}
                        className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full hover:bg-primary-100 transition-colors"
                    >
                        {quote.category.nameBn}
                    </Link>
                </div>
                <div className="absolute bottom-4 right-4 text-6xl font-serif text-primary-100 rotate-180 select-none">"</div>

                {/* Branding watermark for download */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 download-visible">
                    banglaquotes.com
                </div>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1" title="Views">
                        <Eye className="w-4 h-4" />
                        <span>{quote.views}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Downloads">
                        <Download className="w-4 h-4" />
                        <span>{quote.downloads}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "p-2 rounded-full transition-all",
                            copied
                                ? "text-green-600 bg-green-50"
                                : "text-gray-600 hover:text-primary-600 hover:bg-primary-50"
                        )}
                        title={copied ? "Copied!" : "Copy Text"}
                    >
                        {copied ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            <Copy className="w-5 h-5" />
                        )}
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                        title="Download Image"
                    >
                        <Download className={cn("w-5 h-5", isDownloading && "animate-pulse")} />
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setShowShareMenu(!showShareMenu)}
                            className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                            title="Share"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>

                        {showShareMenu && (
                            <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-100 p-2 flex flex-col gap-1 min-w-[150px]">
                                <button
                                    onClick={() => handleShare('facebook')}
                                    className="px-3 py-2 text-left text-sm hover:bg-gray-50 rounded text-gray-700"
                                >
                                    Facebook
                                </button>
                                <button
                                    onClick={() => handleShare('whatsapp')}
                                    className="px-3 py-2 text-left text-sm hover:bg-gray-50 rounded text-gray-700"
                                >
                                    WhatsApp
                                </button>
                                <button
                                    onClick={() => handleShare('twitter')}
                                    className="px-3 py-2 text-left text-sm hover:bg-gray-50 rounded text-gray-700"
                                >
                                    Twitter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
