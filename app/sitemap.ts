import { MetadataRoute } from 'next'
import { templates } from '@/data/templates'
import { seoConfig } from './seo.config'

const url = seoConfig.canonical!

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${url}/clients/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${url}/grant-types`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${url}/openid/providers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...templates.map((template) => ({
      url: `${url}/templates/${template.identifier}`,
      lastModified: new Date(),
      priority: 1,
    })),
  ]
}
