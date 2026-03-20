import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/audit/intake', '/audit/thank-you', '/admin', '/dashboard'],
      },
    ],
    sitemap: 'https://parsiktechgroup.com/sitemap.xml',
  }
}
