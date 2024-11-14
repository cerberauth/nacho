export type Template = {
  name: string
  description: string
  icon: {
    contentUrl: string
  }
  technologies: string[]
  libraries?: Array<{
    name: string
    description?: string
    url: string
  }>
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
import dartSpa from './dart-spa.json' assert { type: 'json' }
import dotnetWebApp from './dotnet-web-app.json' assert { type: 'json' }
import elixirApp from './elixir-app.json' assert { type: 'json' }
import elysiaJSApp from './elysiajs-app.json' assert { type: 'json' }
import encoreTSApp from './encorets-app.json' assert { type: 'json' }
import erlangApp from './erlang-app.json' assert { type: 'json' }
import expressJsApp from './expressjs-app.json' assert { type: 'json' }
import fastifyApp from './fastify-app.json' assert { type: 'json' }
import flutterWebSpa from './flutter-web-spa.json' assert { type: 'json' }
import golangApp from './golang-app.json' assert { type: 'json' }
import golangBeegoApp from './golang-beego-app.json' assert { type: 'json' }
import golangEchoApp from './golang-echo-app.json' assert { type: 'json' }
import golangFiberApp from './golang-fiber-app.json' assert { type: 'json' }
import golangGinApp from './golang-gin-app.json' assert { type: 'json' }
import hapiApp from './hapi-app.json' assert { type: 'json' }
import haskellApp from './haskell-app.json' assert { type: 'json' }
import honoApp from './hono-app.json' assert { type: 'json' }
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
import nodejsApp from './nodejs-app.json' assert { type: 'json' }
import phpApp from './php-app.json' assert { type: 'json' }
import preactSpa from './preact-spa.json' assert { type: 'json' }
import pythonApp from './python-app.json' assert { type: 'json' }
import pythonDjangoApp from './python-django-app.json' assert { type: 'json' }
import pythonFastAPIApp from './python-fastapi-app.json' assert { type: 'json' }
import pythonFlaskApp from './python-flask-app.json' assert { type: 'json' }
import pythonFletApp from './python-flet-app.json' assert { type: 'json' }
import pythonStarletteApp from './python-starlette-app.json' assert { type: 'json' }
import reactSpa from './react-spa.json' assert { type: 'json' }
import remixApp from './remix-app.json' assert { type: 'json' }
import rubyApp from './ruby-app.json' assert { type: 'json' }
import rustApp from './rust-app.json' assert { type: 'json' }
import sailsJsApp from './sailsjs-app.json' assert { type: 'json' }
import scalaApp from './scala-app.json' assert { type: 'json' }
import spa from './spa.json' assert { type: 'json' }
import svelteSpa from './svelte-spa.json' assert { type: 'json' }
import swiftWebApp from './swift-web-app.json' assert { type: 'json' }
import swiftVaporWebApp from './swift-vapor-web-app.json' assert { type: 'json' }
import symfonyApp from './symfony-app.json' assert { type: 'json' }
import vueSpa from './vue-spa.json' assert { type: 'json' }
import webApp from './web-app.json' assert { type: 'json' }
import yiiApp from './yii-app.json' assert { type: 'json' }
import zendFrameworkApp from './zend-framework-app.json' assert { type: 'json' }

export {
  angularSpa,
  astroApp,
  codeigniterApp,
  dartSpa,
  dotnetWebApp,
  elixirApp,
  elysiaJSApp,
  encoreTSApp,
  erlangApp,
  expressJsApp,
  fastifyApp,
  flutterWebSpa,
  golangApp,
  golangBeegoApp,
  golangEchoApp,
  golangFiberApp,
  golangGinApp,
  hapiApp,
  haskellApp,
  honoApp,
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
  nodejsApp,
  phpApp,
  preactSpa,
  pythonApp,
  pythonDjangoApp,
  pythonFastAPIApp,
  pythonFlaskApp,
  pythonFletApp,
  pythonStarletteApp,
  reactSpa,
  remixApp,
  rubyApp,
  rustApp,
  sailsJsApp,
  scalaApp,
  spa,
  svelteSpa,
  swiftWebApp,
  swiftVaporWebApp,
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
  dartSpa,
  dotnetWebApp,
  elixirApp,
  elysiaJSApp,
  encoreTSApp,
  erlangApp,
  expressJsApp,
  fastifyApp,
  flutterWebSpa,
  golangApp,
  golangBeegoApp,
  golangEchoApp,
  golangFiberApp,
  golangGinApp,
  hapiApp,
  haskellApp,
  honoApp,
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
  nodejsApp,
  phpApp,
  preactSpa,
  pythonApp,
  pythonDjangoApp,
  pythonFastAPIApp,
  pythonFlaskApp,
  pythonFletApp,
  pythonStarletteApp,
  reactSpa,
  remixApp,
  rubyApp,
  rustApp,
  sailsJsApp,
  scalaApp,
  spa,
  svelteSpa,
  swiftWebApp,
  swiftVaporWebApp,
  symfonyApp,
  vueSpa,
  webApp,
  yiiApp,
  zendFrameworkApp,
] as Template[]
