'use client'

import { useEffect } from 'react'

type Props = {
  pathTemplate: string
}

export function LocaleRedirect({ pathTemplate }: Props) {
  useEffect(() => {
    const lang = navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en'
    window.location.replace(`/${lang}${pathTemplate}`)
  }, [pathTemplate])

  return null
}
