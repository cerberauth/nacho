'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import en from '@/dictionaries/en.json'
import fr from '@/dictionaries/fr.json'

const dicts = { en, fr } as const

export default function NotFound() {
  const params = useParams<{ lang: 'en' | 'fr' }>()
  const lang = params?.lang ?? 'en'
  const dict = dicts[lang] ?? dicts.en

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">{dict.notFound.title}</span>
        <p className="text-center text-muted-foreground">
          {dict.notFound.description}
        </p>
        <div className="mt-6 flex gap-4">
          <Button asChild>
            <Link href={`/${lang}`}>{dict.notFound.backToHome}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
