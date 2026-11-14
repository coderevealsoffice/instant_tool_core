import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://devigo.cloud'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/admin/',
          '/super-admin/',
          '/employee/',
          '/api/',
          '/auth/verify',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Mediapartners-Google',
          'Google-Extended',
          'ChatGPT-User',
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
        ],
        allow: [
          '/',
          '/llms.txt',
          '/llms-full.txt',
          '/ads.txt',
        ],
        disallow: [
          '/dashboard/',
          '/admin/',
          '/super-admin/',
          '/employee/',
          '/api/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
