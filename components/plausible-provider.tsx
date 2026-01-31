'use client'

import PlausibleProvider from 'next-plausible'

export function ClientPlausibleProvider({
  children,
  ...props
}: React.ComponentProps<typeof PlausibleProvider>) {
  return <PlausibleProvider {...props}>{children}</PlausibleProvider>
}
