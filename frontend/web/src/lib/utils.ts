import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('bn-BD').format(num);
}

export function truncate(text: string, length: number = 100): string {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

export function shareOnFacebook(url: string) {
    if (typeof window !== 'undefined') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
}

export function shareOnTwitter(text: string, url: string) {
    if (typeof window !== 'undefined') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    }
}

export function shareOnWhatsApp(text: string) {
    if (typeof window !== 'undefined') {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
}

export async function downloadAsImage(element: HTMLElement, filename: string) {
    if (typeof window === 'undefined') return;

    try {
        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(element, {
            useCORS: true,
            scale: 2, // Better quality
            backgroundColor: null,
        });

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error('Failed to download image:', error);
    }
}
