import { templates } from '@/templates'

export const getTemplateById = (id: string) => {
  return templates.find((t) => t.identifier === id)
}
