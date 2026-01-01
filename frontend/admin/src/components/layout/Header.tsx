'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

export default function Header() {
    const pathname = usePathname();

    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean);
        return paths.map((path, index) => ({
            label: path.charAt(0).toUpperCase() + path.slice(1),
            href: '/' + paths.slice(0, index + 1).join('/'),
        }));
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-900 font-medium">Home</span>
                {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4" />
                        <span className={index === breadcrumbs.length - 1 ? 'text-gray-900 font-medium' : ''}>
                            {crumb.label}
                        </span>
                    </div>
                ))}
            </div>
        </header>
    );
}
