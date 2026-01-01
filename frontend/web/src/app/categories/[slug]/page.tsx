import { Metadata } from 'next';
import CategoryDetailClient from '@/components/categories/CategoryDetailClient';
import { categoriesApi } from '@/lib/api';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const { data } = await categoriesApi.getBySlug(params.slug);
        return {
            title: `${data.nameBn} উক্তি - বাংলা কোটস`,
            description: `${data.nameBn} সম্পর্কিত সেরা বাংলা উক্তি ও স্ট্যাটাসগুলো এখানে দেখুন।`,
            openGraph: {
                title: `${data.nameBn} উক্তি - বাংলা কোটস`,
                description: `${data.nameBn} সম্পর্কিত সেরা বাংলা উক্তি ও স্ট্যাটাসগুলো এখানে দেখুন।`,
            },
        };
    } catch (error) {
        return {
            title: 'ক্যাটাগরি - বাংলা কোটস',
        };
    }
}

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
    return <CategoryDetailClient slug={params.slug} />;
}
