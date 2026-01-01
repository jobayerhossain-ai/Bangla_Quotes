/**
 * Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

/**
 * Merge Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date
 */
export function formatDate(date: string | Date, formatStr: string = 'PPP') {
    return format(new Date(date), formatStr);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number = 100): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Failed to copy:', error);
        return false;
    }
}

/**
 * Download as file
 */
export function downloadFile(content: string, filename: string, type: string = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Parse CSV
 */
export function parseCSV(csv: string): string[][] {
    const lines = csv.split('\n');
    return lines.map((line) => line.split(',').map((cell) => cell.trim()));
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        DRAFT: 'bg-gray-100 text-gray-800',
        PUBLISHED: 'bg-green-100 text-green-800',
        ARCHIVED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get status badge variant
 */
export function getStatusVariant(status: string): 'default' | 'success' | 'danger' | 'warning' {
    const variants: Record<string, 'default' | 'success' | 'danger' | 'warning'> = {
        DRAFT: 'default',
        REVIEW: 'warning',
        PUBLISHED: 'success',
        ARCHIVED: 'danger',
    };
    return variants[status] || 'default';
}
