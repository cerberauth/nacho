export type Template = {
  name: string
  description: string
  icon: {
    contentUrl: string
  }
  technologies: string[]
  example?: {
    name: string
    url: string
    repository: {
      url: string
    }
  }
  client: {
    applicationType: string
    grantTypes: string[]
    tokenEndpointAuthMethods: string[]
    scopes: string[]
  }
  identifier: string
}

import angularSpa from './angular-spa.json' assert { type: 'json' }
import astroApp from './astro-app.json' assert { type: 'json' }
import flutterWebSpa from './flutter-web-spa.json' assert { type: 'json' }
import nextjsApp from './nextjs-app.json' assert { type: 'json' }
import preactSpa from './preact-spa.json' assert { type: 'json' }
import reactSpa from './react-spa.json' assert { type: 'json' }
import remixApp from './remix-app.json' assert { type: 'json' }
import rustApp from './rust-app.json' assert { type: 'json' }
import spa from './spa.json' assert { type: 'json' }
import svelteSpa from './svelte-spa.json' assert { type: 'json' }
import vueSpa from './vue-spa.json' assert { type: 'json' }
import webApp from './web-app.json' assert { type: 'json' }

export {
  angularSpa,
  astroApp,
  flutterWebSpa,
  nextjsApp,
  preactSpa,
  reactSpa,
  remixApp,
  rustApp,
  spa,
  svelteSpa,
  vueSpa,
  webApp,
}
export const templates: Template[] = [
  angularSpa,
  astroApp,
  flutterWebSpa,
  nextjsApp,
  preactSpa,
  reactSpa,
  remixApp,
  rustApp,
  spa,
  svelteSpa,
  vueSpa,
  webApp,
]
