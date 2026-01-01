import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    title?: string;
    subtitle?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
    headerAction?: ReactNode;
}

export default function Card({
    title,
    subtitle,
    children,
    footer,
    className,
    headerAction,
}: CardProps) {
    return (
        <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
            {(title || subtitle || headerAction) && (
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                    </div>
                    {headerAction && <div>{headerAction}</div>}
                </div>
            )}
            <div className="p-6">{children}</div>
            {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    {footer}
                </div>
            )}
        </div>
    );
}
