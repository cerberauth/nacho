import { ArrowUpRight, GitPullRequest } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { TemplateCard } from '@/components/template-card'
import { Card } from '@/components/ui/card'
import { templates } from '@/templates'
import { applicationTypeName, grantTypeName, grantTypeReferences, tokenAuthenticationMethod, tokenAuthenticationMethodReferences } from '@/lib/getters'

const getTemplateById = (id: string) => {
  return templates.find((t) => t.identifier === id)
}

function ListItemWithReferences({ name, references }: { name: string, references: string[] }) {
  return (
    <>
      {name}
      {' '}
      (<Link href={references[0]} target="_blank" className="inline-flex text-xs underline">
        Reference
        <ArrowUpRight className="w-3 h-3 ml-1 inline-block" />
      </Link>)
    </>
  )
}

function GrantTypeListItem({ grantType }: { grantType: string }) {
  const name = useMemo(() => grantTypeName(grantType) || grantType, [grantType])
  const references = useMemo(() => grantTypeReferences(grantType), [grantType])

  return (
    <ListItemWithReferences name={name} references={references} />
  )
}

function TokenAuthenticationMethodListItem({ authMethod }: { authMethod: string }) {
  const name = useMemo(() => tokenAuthenticationMethod(authMethod) || authMethod, [authMethod])
  const references = useMemo(() => tokenAuthenticationMethodReferences(authMethod), [authMethod])

  return (
    <ListItemWithReferences name={name} references={references} />
  )
}

export const dynamicParams = false

type Props = {
  params: { template: string }
}

export default function TemplatePage({ params }: Props) {
  const template = useMemo(() => getTemplateById(params.template), [params.template])
  const sameApplicationTypeTemplates = useMemo(() => templates.filter((_template) => _template.client.applicationType === template?.client.applicationType), [template])

  if (!template) {
    return null
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-16">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
        <div className="space-y-4 col-span-2">
          {template.icon?.contentUrl && (
            <Image
              src={template.icon?.contentUrl}
              height={64}
              width={64}
              alt={template.name}
            />
          )}
          <h1 className="text-5xl font-semibold leading-none tracking-tight">
            {template.name} Client Template
          </h1>
          <p className="font-medium text-lg max-w-none">
            {template.description}
          </p>
        </div>

        <Card className="p-8">
          <dl className="space-y-4">
            <div>
              <dt className="font-medium mb-1">Application Type</dt>
              <dd>{applicationTypeName(template.client.applicationType)}</dd>
            </div>
            {template.technologies.length > 0 && (
              <div>
                <dt className="font-medium mb-1">Technologies</dt>
                <dd>
                  {template.technologies.join(', ')}
                </dd>
              </div>
            )}
            {template.example && (
              <div>
                <dt className="font-medium mb-1">Example</dt>
                <dd>
                  <Link href={template.example.url} className="underline" rel="nofollow" target="_blank">
                    {template.example.name}
                    <ArrowUpRight className="mx-1 w-4 h-4 inline-block" />
                  </Link>
                  <span className="text-sm">
                    (<Link href={template.example.repository.url} rel="nofollow noopener" target="_blank">
                      Github
                      <GitPullRequest className="ml-1 w-3 h-3 inline-block" />
                    </Link>)
                  </span>
                </dd>
              </div>
            )}
          </dl>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Which Grant Types for {template.name}?</h2>
        <p>
          {template.name} can use one or many of the following OAuth Grant Types:
          <ul className="text-sm my-4 ml-6 list-disc [&>li]:mt-2">
            {template.client.grantTypes.map((grantType) => (
              <GrantTypeListItem key={grantType} grantType={grantType} />
            ))}
          </ul>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Which Token Endpoint Authentication Methods for {template.name}?</h2>
        <p>
          {template.name} can use one or many of the following OAuth Token Endpoint Authentication Methods:
          <ul className="text-sm my-4 ml-6 list-disc [&>li]:mt-2">
            {template.client.tokenEndpointAuthMethods.map((authMethod) => (
              <TokenAuthenticationMethodListItem key={authMethod} authMethod={authMethod} />
            ))}
          </ul>
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Related Templates</h2>
        <div className="grid grid-cols-3 gap-4">
          {sameApplicationTypeTemplates.map((template) => (
            <TemplateCard key={template.identifier} template={template} />
          ))}
        </div>
      </div>
    </main>
  )
}

export function generateMetadata({ params }: Props) {
  const template = getTemplateById(params.template)
  if (!template) {
    return null
  }

  return {
    title: `${template.name} OAuth / OpenID Connect Client Template`,
    description: template.description,
    image: template.icon?.contentUrl
  }
}

export function generateStaticParams() {
  return templates.map((template) => ({
    template: template.identifier
  }))
}
