'use client'

import { useEffect } from 'react'

export function ClientPlausibleProvider() {
  useEffect(() => {
    import('@plausible-analytics/tracker').then(({ init }) => {
      init({
        domain: 'nacho.cerberauth.com',
        endpoint: 'https://a.cerberauth.com/api/event',
        outboundLinks: true,
        captureOnLocalhost: true,
      })
    })
  }, [])

  return null
}
