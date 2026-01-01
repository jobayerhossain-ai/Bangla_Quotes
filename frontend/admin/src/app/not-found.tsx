'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Not Found</h1>
            <p className="text-gray-600 mb-8">The admin page you are looking for does not exist.</p>
            <Link href="/" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Go to Dashboard
            </Link>
        </div>
    );
}
