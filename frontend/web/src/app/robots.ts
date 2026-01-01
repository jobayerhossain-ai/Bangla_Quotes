import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/studio?*'],
        },
        sitemap: `${process.env.NEXT_PUBLIC_URL || 'https://banglaquotes.com'}/sitemap.xml`,
    };
}
