import { locales } from '@/lib/dictionaries'
import { langUrl } from '@/lib/lang'
import { baseUrl } from '@/app/seo.config'

export function makeLanguageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `${baseUrl}${langUrl(l, path)}`])),
    'x-default': `${baseUrl}${langUrl('en', path)}`,
  }
}

export function makeCanonical(lang: string, path: string): string {
  return `${baseUrl}${langUrl(lang, path)}`
}
