import { MetadataRoute } from 'next'
import { templates } from '@/data/templates'
import { baseUrl } from './seo.config'

import useCasesJson from '@/data/mdx/use-cases.json'
import { providers as openIDConnectProviders } from '@/data/openid/providers'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    ...openIDConnectProviders.map((provider) => ({
      url: `${baseUrl}/openid/providers/${provider.identifier}`,
      lastModified,
      priority: 1,
    })),
    {
      url: `${baseUrl}/use-cases`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...useCasesJson.map((useCase) => ({
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
