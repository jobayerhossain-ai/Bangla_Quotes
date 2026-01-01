import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth';

const hindSiliguri = Hind_Siliguri({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['bengali', 'latin'],
    variable: '--font-hind-siliguri',
});

export const metadata: Metadata = {
    title: 'Bangla Quotes - Admin Panel',
    description: 'Admin panel for managing Bangla quotes',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${hindSiliguri.variable} font-sans antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
