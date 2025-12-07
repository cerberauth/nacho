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

import angularSpa from './angular-spa.json' with { type: 'json' }
import astroApp from './astro-app.json' with { type: 'json' }
import codeigniterApp from './codeigniter-app.json' with { type: 'json' }
import dartSpa from './dart-spa.json' with { type: 'json' }
import dotnetWebApp from './dotnet-web-app.json' with { type: 'json' }
import elixirApp from './elixir-app.json' with { type: 'json' }
import elysiaJSApp from './elysiajs-app.json' with { type: 'json' }
import encoreTSApp from './encorets-app.json' with { type: 'json' }
import erlangApp from './erlang-app.json' with { type: 'json' }
import expressJsApp from './expressjs-app.json' with { type: 'json' }
import fastifyApp from './fastify-app.json' with { type: 'json' }
import flutterWebSpa from './flutter-web-spa.json' with { type: 'json' }
import golangApp from './golang-app.json' with { type: 'json' }
import golangBeegoApp from './golang-beego-app.json' with { type: 'json' }
import golangEchoApp from './golang-echo-app.json' with { type: 'json' }
import golangFiberApp from './golang-fiber-app.json' with { type: 'json' }
import golangGinApp from './golang-gin-app.json' with { type: 'json' }
import hapiApp from './hapi-app.json' with { type: 'json' }
import haskellApp from './haskell-app.json' with { type: 'json' }
import honoApp from './hono-app.json' with { type: 'json' }
import javaWebApp from './java-web-app.json' with { type: 'json' }
import javaJHipsterApp from './java-jhipster-app.json' with { type: 'json' }
import javaPlayFrameworkApp from './java-play-framework-app.json' with { type: 'json' }
import javaSpringApp from './java-spring-app.json' with { type: 'json' }
import javaStrutsApp from './java-struts-app.json' with { type: 'json' }
import javaVaadinApp from './java-vaadin-app.json' with { type: 'json' }
import kotlinWebApp from './kotlin-web-app.json' with { type: 'json' }
import laravelApp from './laravel-app.json' with { type: 'json' }
import meteorJsApp from './meteorjs-app.json' with { type: 'json' }
import nestJsApp from './nestjs-app.json' with { type: 'json' }
import nextjsApp from './nextjs-app.json' with { type: 'json' }
import nodejsApp from './nodejs-app.json' with { type: 'json' }
import nuxtApp from './nuxt-app.json' with { type: 'json' }
import phpApp from './php-app.json' with { type: 'json' }
import preactSpa from './preact-spa.json' with { type: 'json' }
import pythonApp from './python-app.json' with { type: 'json' }
import pythonDjangoApp from './python-django-app.json' with { type: 'json' }
import pythonFastAPIApp from './python-fastapi-app.json' with { type: 'json' }
import pythonFlaskApp from './python-flask-app.json' with { type: 'json' }
import pythonFletApp from './python-flet-app.json' with { type: 'json' }
import pythonStarletteApp from './python-starlette-app.json' with { type: 'json' }
import qwikSpa from './qwik-spa.json' with { type: 'json' }
import reactSpa from './react-spa.json' with { type: 'json' }
import remixApp from './remix-app.json' with { type: 'json' }
import rubyApp from './ruby-app.json' with { type: 'json' }
import rustActixApp from './rust-actix-app.json' with { type: 'json' }
import rustApp from './rust-app.json' with { type: 'json' }
import rustAxumApp from './rust-axum-app.json' with { type: 'json' }
import rustRocketApp from './rust-rocket-app.json' with { type: 'json' }
import sailsJsApp from './sailsjs-app.json' with { type: 'json' }
import scalaApp from './scala-app.json' with { type: 'json' }
import spa from './spa.json' with { type: 'json' }
import svelteSpa from './svelte-spa.json' with { type: 'json' }
import swiftWebApp from './swift-web-app.json' with { type: 'json' }
import swiftVaporWebApp from './swift-vapor-web-app.json' with { type: 'json' }
import symfonyApp from './symfony-app.json' with { type: 'json' }
import vueSpa from './vue-spa.json' with { type: 'json' }
import webApp from './web-app.json' with { type: 'json' }
import windevApp from './windev-app.json' with { type: 'json' }
import yiiApp from './yii-app.json' with { type: 'json' }
import zendFrameworkApp from './zend-framework-app.json' with { type: 'json' }

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
  nuxtApp,
  phpApp,
  preactSpa,
  pythonApp,
  pythonDjangoApp,
  pythonFastAPIApp,
  pythonFlaskApp,
  pythonFletApp,
  pythonStarletteApp,
  qwikSpa,
  reactSpa,
  remixApp,
  rubyApp,
  rustActixApp,
  rustApp,
  rustAxumApp,
  rustRocketApp,
  sailsJsApp,
  scalaApp,
  spa,
  svelteSpa,
  swiftWebApp,
  swiftVaporWebApp,
  symfonyApp,
  vueSpa,
  webApp,
  windevApp,
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
  nuxtApp,
  phpApp,
  preactSpa,
  pythonApp,
  pythonDjangoApp,
  pythonFastAPIApp,
  pythonFlaskApp,
  pythonFletApp,
  pythonStarletteApp,
  qwikSpa,
  reactSpa,
  remixApp,
  rubyApp,
  rustActixApp,
  rustApp,
  rustAxumApp,
  rustRocketApp,
  sailsJsApp,
  scalaApp,
  spa,
  svelteSpa,
  swiftWebApp,
  swiftVaporWebApp,
  symfonyApp,
  vueSpa,
  webApp,
  windevApp,
  yiiApp,
  zendFrameworkApp,
] as Template[]
