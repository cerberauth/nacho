'use client'

import { useEffect } from 'react'

let isInitialized = false

export function ClientPlausibleProvider() {
  useEffect(() => {
    if (isInitialized) {
      return
    }

    import('@plausible-analytics/tracker').then(({ init }) => {
      if (isInitialized) {
        return
      }

      init({
        domain: 'nacho.cerberauth.com',
        endpoint: 'https://a.cerberauth.com/api/event',
        outboundLinks: true,
        captureOnLocalhost: true,
      })
      isInitialized = true
    })
  }, [])

  return null
}
