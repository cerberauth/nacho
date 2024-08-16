import { templates } from '@/templates'
import { TemplateCard } from '@/components/template-card'

export default function TemplatePage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard key={template.identifier} template={template} />
        ))}
      </div>
    </main>
  )
}
