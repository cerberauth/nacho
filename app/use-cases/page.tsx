import Link from 'next/link'

import useCasesJson from '@/data/mdx/use-cases.json'

export const metadata = {
  title: 'OpenID Connect and IAM Use Cases',
  description: 'Read about common use cases for OpenID Connect and IAM',
}

export const dynamic = 'force-static'

export default async function Page() {
  return (
    <main className="flex flex-col max-w-2xl mx-auto items-center justify-center my-8">
      <h1 className="font-semibold text-4xl mb-8 tracking-tighter">OpenID Connect and IAM Use Cases</h1>

      <div>
        {useCasesJson
          .map((useCase) => (
            <Link
              key={useCase.slug}
              className="flex flex-col space-y-1 mb-4"
              href={`/use-cases/${useCase.slug}`}
            >
              <div className="w-full flex flex-col md:flex-row space-x-0 md:space-x-2">
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {useCase.metadata.title}
                </p>
              </div>
            </Link>
          ))}
      </div>
    </main>
  )
}
