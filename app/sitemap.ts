import { MetadataRoute } from 'next'
import { templates } from '@/data/templates'
import { baseUrl } from './seo.config'
import { langUrl } from '@/lib/lang'
import { locales } from '@/lib/dictionaries'

import useCasesJson from '@/data/mdx/use-cases.json'
import { providers as openIDConnectProviders } from '@/data/openid/providers'
import { providers as iamProviders } from '@/data/iam/index'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const makeEntry = (path: string, priority: number, changeFrequency?: MetadataRoute.Sitemap[0]['changeFrequency']) =>
    locales.map((lang) => ({
      url: `${baseUrl}${langUrl(lang, path)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}${langUrl(l, path)}`])
        ) as Record<string, string>,
      },
    }))

  return [
    // Home pages
    ...makeEntry('', 1, 'yearly'),
    ...makeEntry('/clients/create', 0.8, 'weekly'),
    ...makeEntry('/grant-types', 0.8, 'weekly'),
    ...makeEntry('/openid/providers', 0.8, 'weekly'),
    ...openIDConnectProviders.flatMap((provider) =>
      makeEntry(`/openid/providers/${provider.identifier}`, 1)
    ),
    ...makeEntry('/iam/providers', 0.8, 'weekly'),
    ...iamProviders.flatMap((provider) =>
      makeEntry(`/iam/providers/${provider.identifier}`, 1)
    ),
    ...makeEntry('/use-cases', 0.8, 'weekly'),
    ...useCasesJson.flatMap((useCase) =>
      makeEntry(`/use-cases/${useCase.slug}`, 1)
    ),
    ...templates.flatMap((template) =>
      makeEntry(`/templates/${template.identifier}`, 1)
    ),
  ]
}
