import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    // Replace this with your actual live domain when you launch
    const baseUrl = process.env.NEXT_PUBLIC_SITEURL ?? "https://mileglide.narendra-dubey.in";

    return [
        {
            url: baseUrl, // Home page (app/page.tsx)
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0, // Highest priority
        },
        {
            url: `${baseUrl}/privacy`, // app/(public)/privacy
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`, // app/(public)/terms
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];
}