import { MetadataRoute } from 'next'
import { templates } from '@/templates'
import { url } from './seo.config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: url,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${url}clients/create`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${url}grant-types`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...templates.map((template) => ({
      url: `${url}templates/${template.identifier}`,
      lastModified: new Date(),
      priority: 1,
    })),
  ]
}
