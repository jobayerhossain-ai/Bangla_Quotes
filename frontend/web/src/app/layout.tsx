import type { Metadata } from 'next';
import { Hind_Siliguri } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const hindSiliguri = Hind_Siliguri({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ['bengali', 'latin'],
    variable: '--font-hind-siliguri',
});

export const metadata: Metadata = {
    title: 'Bangla Quotes - সুন্দর বাংলা উক্তির সংগ্রহ',
    description: 'জীবন, ভালোবাসা, অনুপ্রেরণা এবং আরও অনেক বিষয়ে সুন্দর বাংলা উক্তি।',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bn">
            <body className={`${hindSiliguri.variable} font-sans antialiased min-h-screen flex flex-col`}>
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
