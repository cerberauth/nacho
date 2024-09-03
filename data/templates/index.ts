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
import dotnetWebApp from './dotnet-web-app.json' assert { type: 'json' }
import elixirApp from './elixir-app.json' assert { type: 'json' }
import expressJsApp from './expressjs-app.json' assert { type: 'json' }
import flutterWebSpa from './flutter-web-spa.json' assert { type: 'json' }
import golangApp from './golang-app.json' assert { type: 'json' }
import golangBeegoApp from './golang-beego-app.json' assert { type: 'json' }
import golangEchoApp from './golang-echo-app.json' assert { type: 'json' }
import golangFiberApp from './golang-fiber-app.json' assert { type: 'json' }
import golangGinApp from './golang-gin-app.json' assert { type: 'json' }
import hapiApp from './hapi-app.json' assert { type: 'json' }
import haskellApp from './haskell-app.json' assert { type: 'json' }
import javaWebApp from './java-web-app.json' assert { type: 'json' }
import javaJHipsterApp from './java-jhipster-app.json' assert { type: 'json' }
import javaPlayFrameworkApp from './java-play-framework-app.json' assert { type: 'json' }
import javaSpringApp from './java-spring-app.json' assert { type: 'json' }
import javaStrutsApp from './java-struts-app.json' assert { type: 'json' }
import javaVaadinApp from './java-vaadin-app.json' assert { type: 'json' }
import kotlinWebApp from './kotlin-web-app.json' assert { type: 'json' }
import laravelApp from './laravel-app.json' assert { type: 'json' }
import meteorJsApp from './meteorjs-app.json' assert { type: 'json' }
import nestJsApp from './nestjs-app.json' assert { type: 'json' }
import nextjsApp from './nextjs-app.json' assert { type: 'json' }
import phpApp from './php-app.json' assert { type: 'json' }
import preactSpa from './preact-spa.json' assert { type: 'json' }
import pythonApp from './python-app.json' assert { type: 'json' }
import reactSpa from './react-spa.json' assert { type: 'json' }
import remixApp from './remix-app.json' assert { type: 'json' }
import rubyApp from './ruby-app.json' assert { type: 'json' }
import rustApp from './rust-app.json' assert { type: 'json' }
import sailsJsApp from './sailsjs-app.json' assert { type: 'json' }
import scalaApp from './scala-app.json' assert { type: 'json' }
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
  dotnetWebApp,
  elixirApp,
  expressJsApp,
  flutterWebSpa,
  golangApp,
  golangBeegoApp,
  golangEchoApp,
  golangFiberApp,
  golangGinApp,
  hapiApp,
  haskellApp,
  javaWebApp,
  javaJHipsterApp,
  javaPlayFrameworkApp,
  javaSpringApp,
  javaStrutsApp,
  javaVaadinApp,
  kotlinWebApp,
  laravelApp,
  meteorJsApp,
  nestJsApp,
  nextjsApp,
  phpApp,
  preactSpa,
  pythonApp,
  reactSpa,
  remixApp,
  rubyApp,
  rustApp,
  sailsJsApp,
  scalaApp,
  spa,
  svelteSpa,
  symfonyApp,
  vueSpa,
  webApp,
  yiiApp,
  zendFrameworkApp,
}

export const templates = [
  angularSpa,
  astroApp,
  codeigniterApp,
  dotnetWebApp,
  elixirApp,
  expressJsApp,
  flutterWebSpa,
  golangApp,
  golangBeegoApp,
  golangEchoApp,
  golangFiberApp,
  golangGinApp,
  hapiApp,
  haskellApp,
  javaWebApp,
  javaJHipsterApp,
  javaPlayFrameworkApp,
  javaSpringApp,
  javaStrutsApp,
  javaVaadinApp,
  kotlinWebApp,
  laravelApp,
  meteorJsApp,
  nestJsApp,
  nextjsApp,
  phpApp,
  preactSpa,
  pythonApp,
  reactSpa,
  remixApp,
  rubyApp,
  rustApp,
  sailsJsApp,
  scalaApp,
  spa,
  svelteSpa,
  symfonyApp,
  vueSpa,
  webApp,
  yiiApp,
  zendFrameworkApp,
] as Template[]