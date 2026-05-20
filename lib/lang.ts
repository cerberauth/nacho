export function langUrl(lang: string, path: string): string {
  if (lang === 'en') return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}
