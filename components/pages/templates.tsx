import type { Metadata } from 'next'

import { type Locale } from '@/lib/dictionaries'
import { makeCanonical, makeLanguageAlternates } from '@/lib/metadata'
import { templates } from '@/data/templates'
import { TemplateCard } from '@/components/template-card'

export function generateTemplatesMetadata(lang: Locale): Metadata {
  return {
    alternates: {
      canonical: makeCanonical(lang, '/templates'),
      languages: makeLanguageAlternates('/templates'),
    },
  }
}

export function TemplatesPage({ lang }: { lang: Locale }) {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard key={template.identifier} template={template} lang={lang} />
        ))}
      </div>
    </main>
  )
}
