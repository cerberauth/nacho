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
    applicationType: ApplicationType
    grantTypes: GrantType[]
    tokenEndpointAuthMethods: TokenEndpointAuthMethod[]
    scopes: string[]
  }
  identifier: string
}

import angularSpa from './angular-spa.json' assert { type: 'json' }
import astroApp from './astro-app.json' assert { type: 'json' }
import codeigniterApp from './codeigniter-app.json' assert { type: 'json' }
import expressJsApp from './expressjs-app.json' assert { type: 'json' }
import flutterWebSpa from './flutter-web-spa.json' assert { type: 'json' }
import hapiApp from './hapi-app.json' assert { type: 'json' }
import laravelApp from './laravel-app.json' assert { type: 'json' }
import meteorJsApp from './meteorjs-app.json' assert { type: 'json' }
import nestJsApp from './nestjs-app.json' assert { type: 'json' }
import nextjsApp from './nextjs-app.json' assert { type: 'json' }
import phpApp from './php-app.json' assert { type: 'json' }
import preactSpa from './preact-spa.json' assert { type: 'json' }
import reactSpa from './react-spa.json' assert { type: 'json' }
import remixApp from './remix-app.json' assert { type: 'json' }
import rustApp from './rust-app.json' assert { type: 'json' }
import sailsJsApp from './sailsjs-app.json' assert { type: 'json' }
import spa from './spa.json' assert { type: 'json' }
import svelteSpa from './svelte-spa.json' assert { type: 'json' }
import symfonyApp from './symfony-app.json' assert { type: 'json' }
import vueSpa from './vue-spa.json' assert { type: 'json' }
import webApp from './web-app.json' assert { type: 'json' }
import yiiApp from './yii-app.json' assert { type: 'json' }
import zendFrameworkApp from './zend-framework-app.json' assert { type: 'json' }

export {
  angularSpa,
  astroApp,
  codeigniterApp,
  expressJsApp,
  flutterWebSpa,
  hapiApp,
  laravelApp,
  meteorJsApp,
  nestJsApp,
  nextjsApp,
  phpApp,
  preactSpa,
  reactSpa,
  remixApp,
  rustApp,
  sailsJsApp,
  spa,
  svelteSpa,
  symfonyApp,
  vueSpa,
  webApp,
  yiiApp,
  zendFrameworkApp,
}

export const templates: Template[] = [
  // @ts-expect-error
  angularSpa,
  // @ts-expect-error
  astroApp,
  // @ts-expect-error
  codeigniterApp,
  // @ts-expect-error
  expressJsApp,
  // @ts-expect-error
  flutterWebSpa,
  // @ts-expect-error
  hapiApp,
  // @ts-expect-error
  laravelApp,
  // @ts-expect-error
  meteorJsApp,
  // @ts-expect-error
  nestJsApp,
  // @ts-expect-error
  nextjsApp,
  // @ts-expect-error
  phpApp,
  // @ts-expect-error
  preactSpa,
  // @ts-expect-error
  reactSpa,
  // @ts-expect-error
  remixApp,
  // @ts-expect-error
  rustApp,
  // @ts-expect-error
  sailsJsApp,
  // @ts-expect-error
  spa,
  // @ts-expect-error
  svelteSpa,
  // @ts-expect-error
  symfonyApp,
  // @ts-expect-error
  vueSpa,
  // @ts-expect-error
  webApp,
  // @ts-expect-error
  yiiApp,
  // @ts-expect-error
  zendFrameworkApp,
]
