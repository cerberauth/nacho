import { MetadataRoute } from 'next'
import { seoConfig } from './seo.config'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seoConfig.title,
    short_name: seoConfig.openGraph?.siteName,
    description: seoConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
