import Image from 'next/image'
import type { OpenIDConnectProvider } from '@/data/openid/providers'
import Link from 'next/link'

type ProviderCardProps = {
  provider: OpenIDConnectProvider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <span className="flex flex-col items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-4 py-3 gap-2 transition min-w-[124px] hover:border-slate-300 opacity-30 hover:border-slate-300 hover:opacity-40">
      {provider.icon?.contentUrl && (
        <Image
          className="w-12 my-auto"
          src={provider.icon.contentUrl}
          height={36}
          width={36}
          alt={provider.name}
        />
      )}
      <p className="text-md text-slate-900 dark:text-white whitespace-nowrap mt-4">
        {provider.name}
      </p>
      <p className="text-sm text-slate-500 transition flex gap-2">
        {provider.github && (
          <Link href={provider.github} target="_blank"
            className="flex items-center gap-1 hover:text-slate-800">
            {/* <IconGitHub /> */}
          </Link>
        )}
        {provider.website && (
          <Link href={provider.website} target="_blank"
            className="flex items-center gap-1 hover:text-slate-800">
            {/* <IconGlobe /> */}
          </Link>
        )}
      </p>
    </span >
  )
}
