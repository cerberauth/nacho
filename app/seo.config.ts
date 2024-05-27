import type { DefaultSeoProps } from 'next-seo'


export const url = 'https://nacho.cerberauth.com/'

export const seoConfig: DefaultSeoProps = {
  title: 'Nacho - OAuth / OpenID Connect Client Helper',
  description: 'Nacho help you decide how to create an OAuth Client.',
  canonical: url,

  openGraph: {
    type: 'website',
    locale: 'en',
    url,
    siteName: 'Nacho',
    images: [
      {
        url: `${url}og-image.png`,
        width: 1600,
        height: 800,
        alt: 'Nacho - OAuth / OpenID Connect Client Helper',
      },
    ],
  },
  twitter: {
    handle: '@cerberauth',
    site: '@cerberauth',
    cardType: 'summary_large_image',
  },
}
