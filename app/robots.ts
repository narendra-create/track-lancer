import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/login/',
                '/register/',
                '/forgot-password/',
                '/dashboard/',
                '/client/',
                '/freelancer/',
                '/unauthorized/'
            ]
        },
        sitemap: `${process.env.NEXT_PUBLIC_SITEURL ?? "https://mileglide.narendra-dubey.in"}/sitemap.xml`,
    };
}