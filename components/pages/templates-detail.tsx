import { ArrowUpRight, GitPullRequest } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { ListItemWithReferences } from '@/components/list-item-with-references'
import { TokenAuthenticationMethodListItem } from '@/components/token-authentication-method-list-item'
import { TemplateCard } from '@/components/template-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { templates } from '@/data/templates'
import { applicationTypeName, grantTypeName, grantTypeReferences } from '@/lib/getters'
import { getRelatedTemplates, getTemplateById } from '@/lib/templates'
import { getDictionary, type Locale } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'

function GrantTypeListItem({ grantType }: { grantType: string }) {
  const name = grantTypeName(grantType) || grantType
  const references = grantTypeReferences(grantType)
  return <ListItemWithReferences name={name} references={references} />
}

export async function generateTemplateDetailMetadata(lang: Locale, templateParam: string): Promise<Metadata> {
  const template = getTemplateById(templateParam)
  if (!template) return {}
  const dict = await getDictionary(lang)
  return {
    title: dict.templates.metaTitle.replace('{name}', template.name),
    description: template.description,
    alternates: {
      canonical: makeCanonical(lang, `/templates/${templateParam}`),
      languages: makeLanguageAlternates(`/templates/${templateParam}`),
    },
  }
}

export async function TemplateDetailPage({ lang, templateParam }: { lang: Locale; templateParam: string }) {
  const template = getTemplateById(templateParam)
  if (!template) notFound()

  const dict = await getDictionary(lang)
  const t = dict.templates
  const relatedTemplates = getRelatedTemplates(template.identifier)

  return (
    <main className="container mx-auto max-w-5xl px-4 py-12 space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 my-8">
        <div className="space-y-6 sm:col-span-2 md:col-span-3">
          {template.icon?.contentUrl && (
            <Image
              src={template.icon?.contentUrl}
              height={64}
              width={64}
              alt={template.name}
            />
          )}
          <h1 className="text-5xl font-semibold leading-none tracking-tight">
            {template.name} {t.clientTemplate}
          </h1>
          <p className="font-medium text-lg max-w-none">
            {template.description}
          </p>
        </div>

        <Card className="p-8 sm:col-span-1 md:col-span-2">
          <dl className="space-y-4">
            <div>
              <dt className="font-semibold mb-1">{t.applicationType}</dt>
              <dd>{applicationTypeName(template.client.applicationType)}</dd>
            </div>
            {template.technologies.length > 0 && (
              <div>
                <dt className="font-semibold mb-1">{t.technologies}</dt>
                <dd>
                  {template.technologies.join(', ')}
                </dd>
              </div>
            )}
            {template.example && (
              <div>
                <dd>
                  <Link href={template.example.url} className="underline plausible-event-name=Template+Example+Link+Click" rel="nofollow noopener" target="_blank">
                    <strong>{template.example.name}</strong>
                    <ArrowUpRight className="mx-1 w-4 h-4 inline-block" />
                  </Link>
                  <span className="text-sm">
                    (<Link href={template.example.repository.url} className="plausible-event-name=Template+Example+Repository+Link+Click" rel="nofollow noopener" target="_blank">
                      Github
                      <GitPullRequest className="ml-1 w-3 h-3 inline-block" />
                    </Link>)
                  </span>
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-8 text-center">
            <Button type="button">
              <Link href={langUrl(lang, `/clients/create?template=${template.identifier}`)} className={`plausible-event-name=Create+Client+From+Template+Button+Click plausible-event-template=${template.identifier}`}>
                {t.createClient.replace('{name}', template.name)}
              </Link>
            </Button>
          </div>
        </Card>
      </div>

      {Array.isArray(template.libraries) && template.libraries.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">{t.librariesTitle.replace('{name}', template.name)}</h2>
          <p>
            {t.librariesIntro.replace('{name}', template.name)}
          </p>
          <ul className="text-sm my-4 ml-6 list-disc [&>li]:mt-2">
            {template.libraries.map((library, i) => (
              <li key={i}>
                <Link href={library.url} rel="nofollow noopener" target="_blank" className="underline">
                  {library.name}
                  <ArrowUpRight className="w-3 h-3 ml-1 inline-block" />
                </Link>
                {library.description && (
                  <p className="text-sm mt-2">{library.description}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t.grantTypesTitle.replace('{name}', template.name)}</h2>
        <p>
          {t.grantTypesIntro.replace('{name}', template.name)}
        </p>
        <ul className="text-sm my-4 ml-6 list-disc [&>li]:mt-2">
          {template.client.grantTypes.map((grantType) => (
            <GrantTypeListItem key={grantType} grantType={grantType} />
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t.authMethodsTitle.replace('{name}', template.name)}</h2>
        <p>
          {t.authMethodsIntro.replace('{name}', template.name)}
        </p>
        <ul className="text-sm my-4 ml-6 list-disc [&>li]:mt-2">
          {template.client.tokenEndpointAuthMethods.map((authMethod) => (
            <TokenAuthenticationMethodListItem key={authMethod} authMethod={authMethod} />
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">{t.relatedTemplates}</h2>
        <div className="grid grid-cols-3 gap-4">
          {relatedTemplates.map((template) => (
            <TemplateCard key={template.identifier} template={template} lang={lang} />
          ))}
        </div>
      </div>
    </main>
  )
}
