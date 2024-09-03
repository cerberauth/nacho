import { templates } from '@/data/templates'

export const getTemplateById = (id: string) => {
  return templates.find((t) => t.identifier === id)
}

export const getRelatedTemplates = (id: string) => {
  const template = getTemplateById(id)
  if (!template) {
    return []
  }

  return templates.filter((t) =>
    t.client.applicationType === template.client.applicationType &&
    t.technologies.some((tag) => template.technologies.includes(tag))
  )
}
