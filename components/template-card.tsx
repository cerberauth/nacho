import Image from 'next/image'
import Link from 'next/link'
import type { Template } from '@/data/templates'

type TemplateCardProps = {
  template: Template
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.identifier}`} className="text-center">
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
