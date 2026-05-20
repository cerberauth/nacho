import Image from 'next/image'
import Link from 'next/link'
import type { Template } from '@/data/templates'
import { langUrl } from '@/lib/lang'

type TemplateCardProps = {
  template: Template
  lang?: string
}

export function TemplateCard({ template, lang = 'en' }: TemplateCardProps) {
  return (
    <Link href={langUrl(lang, `/templates/${template.identifier}`)} className="text-center">
      {template.icon?.contentUrl && (
        <Image
          className="mx-auto mb-2"
          src={template.icon.contentUrl}
          height={36}
          width={36}
          alt={template.name}
        />
      )}
      <span className="text-xl font-medium">{template.name}</span>
    </Link>
  )
}
