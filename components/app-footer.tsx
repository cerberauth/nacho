import Link from 'next/link'

import { langUrl } from '@/lib/lang'
import type { Dictionary } from '@/lib/dictionaries'

type AppFooterProps = {
  lang: string
  dict: Dictionary['footer']
}

export function AppFooter({ lang, dict }: AppFooterProps) {
  return (
    <footer className="text-center p-8 space-y-4">
      <p className="text-gray-500 text-sm">
        <Link className="text-primary" href={langUrl(lang, '/clients')}>{dict.clients}</Link>
        {' - '}
        <Link className="text-primary" href={langUrl(lang, '/templates')}>{dict.templates}</Link>
        {' - '}
        <Link className="text-primary" href={langUrl(lang, '/use-cases')}>{dict.useCases}</Link>
        {' - '}
        <Link className="text-primary" href={langUrl(lang, '/iam/providers')}>{dict.iamBenchmark}</Link>
        {' - '}
        <Link className="text-primary" href={langUrl(lang, '/openid/providers')}>{dict.openidBenchmark}</Link>
      </p>
      <p className="text-sm">
        <Link className="text-gray-500 hover:text-gray-600" href="https://www.cerberauth.com/tos/" rel="nofollow" target="_blank">{dict.termsOfService}</Link>
        {' - '}
        <Link className="text-gray-500 hover:text-gray-600" href="https://www.cerberauth.com/privacy/" rel="nofollow" target="_blank">{dict.privacyPolicy}</Link>
        {' - '}
        <Link className="text-gray-500 hover:text-gray-600" href="https://github.com/cerberauth/nacho" rel="nofollow noopener noreferrer" target="_blank">{dict.github}</Link>
      </p>
      <p className="text-sm text-gray-500">
        {dict.partOfCerberAuth}{' '}
        <Link className="text-primary" href="https://www.cerberauth.com/">{dict.cerberAuth}</Link>
        {dict.community}
      </p>
    </footer>
  )
}
