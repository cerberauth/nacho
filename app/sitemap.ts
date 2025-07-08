import { MetadataRoute } from 'next'
import { templates } from '@/data/templates'
import { baseUrl } from './seo.config'
import { getUseCases } from './use-cases/utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const useCases = getUseCases()

  const lastModified = new Date()
  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${baseUrl}/clients/create`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/grant-types`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/openid/providers`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/use-cases`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...useCases.map((useCase) => ({
      url: `${baseUrl}/use-cases/${useCase.slug}`,
      lastModified,
      priority: 1,
    })),
    ...templates.map((template) => ({
      url: `${baseUrl}/templates/${template.identifier}`,
      lastModified,
      priority: 1,
    })),
  ]
}
