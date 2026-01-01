'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold font-bangla text-primary-100 mb-4">৪০৪</h1>
            <h2 className="text-2xl md:text-3xl font-bold font-bangla text-gray-900 mb-4">
                পাতাটি খুঁজে পাওয়া যায়নি
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
                দুঃখিত, আপনি যে পাতাটি খুঁজছেন তা হয়তো সরানো হয়েছে অথবা লিংকটি ভুল।
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Home className="w-5 h-5" />
                    হোম পেজে যান
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    ফিরে যান
                </button>
            </div>
        </div>
    );
}
