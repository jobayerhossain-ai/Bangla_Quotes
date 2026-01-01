'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCardProps {
    category: any;
    className?: string;
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
    // Get the first letter for the icon
    const firstLetter = category.nameBn ? category.nameBn[0] : '?';

    return (
        <Link
            href={`/categories/${category.slug}`}
            className={cn(
                "group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary-100 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden",
                className
            )}
        >
            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500" />
            </div>

            <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:from-primary-500 group-hover:to-secondary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                <span className="text-2xl font-bold font-bangla">{firstLetter}</span>
            </div>

            <h3 className="text-lg font-bold font-bangla text-gray-900 group-hover:text-primary-600 transition-colors">
                {category.nameBn}
            </h3>

            <p className="text-sm text-gray-500 mt-2 font-medium">
                {category._count?.quotes || 0} টি উক্তি
            </p>
        </Link>
    );
}
