export const baseUrl = 'https://nacho.cerberauth.com'

export const seoConfig = {
  title: 'Nacho - OAuth / OpenID Connect Client Helper',
  titleTemplate: '%s | Nacho',
  description: 'Nacho help you decide how to create an OAuth Client.',
  canonical: baseUrl,

  openGraph: {
    type: 'website',
    locale: 'en',
    url: baseUrl,
    siteName: 'Nacho',
    images: [
      {
        url: `${baseUrl}og-image.png`,
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
