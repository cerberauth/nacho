import type { NextConfig } from 'next'

const cspHeader = `
    default-src 'self';
    connect-src 'self' https://a.cerberauth.com;
    script-src 'self' 'unsafe-inline' https://a.cerberauth.com/js/plausible.outbound-links.tagged-events.js;
    style-src 'self' 'unsafe-inline';
    img-src 'self' https://nacho.cerberauth.com;
    frame-src 'none';
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    domains: ['nacho.cerberauth.com'],
  },
  async headers() {
    if (process.env.NODE_ENV === 'development') {
      return []
    }

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://nacho.cerberauth.com',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Permissions-Policy',
            value: 'fullscreen=(self)',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/client/:path*',
        destination: '/clients/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
initOpenNextCloudflareForDev()
