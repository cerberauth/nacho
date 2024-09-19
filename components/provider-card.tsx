import Image from 'next/image'
import type { OpenIDConnectProvider } from '@/data/openid/providers'
import Link from 'next/link'
import { GitHubLogoIcon, GlobeIcon } from '@radix-ui/react-icons'

type ProviderCardProps = {
  provider: OpenIDConnectProvider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <span className="flex flex-col items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-4 py-3 gap-2 transition min-w-[124px] opacity-40 hover:border-slate-300 hover:opacity-40">
      {provider.icon?.contentUrl && (
        <Image
          className="w-12 my-auto"
          src={provider.icon.contentUrl}
          height={36}
          width={36}
          alt={provider.name}
        />
      )}
      <p className="text-md text-center w-full text-slate-900 dark:text-white mt-2">
        {provider.name}
      </p>
      <p className="text-sm text-slate-500">
        {provider.license}
      </p>
      <p className="text-sm text-slate-500 transition flex gap-2">
        {provider.github && (
          <Link href={provider.github} rel="nofollow noopener" target="_blank"
            className="flex items-center gap-1 hover:text-slate-800">
            <GitHubLogoIcon />
          </Link>
        )}
        {provider.website && (
          <Link href={provider.website} rel="nofollow noopener" target="_blank"
            className="flex items-center gap-1 hover:text-slate-800">
            <GlobeIcon />
          </Link>
        )}
      </p>
    </span >
  )
}
