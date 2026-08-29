import {
  ApplicationTypes,
  GrantTypes,
  TokenEndpointAuthMethods,
} from "@/lib/consts"

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
    applicationType: ApplicationTypes
    grantTypes: GrantTypes[]
    tokenEndpointAuthMethods: TokenEndpointAuthMethods[]
    scopes: string[]
  }
  identifier: string
  clientId?: string
}

export type CimdTemplate = {
  client_id?: string
  client_name: string
  description?: string
  identifier?: string
  logo_uri?: string
  keywords?: string[]
  application_type?: string
  grant_types?: string[]
  response_types?: string[]
  token_endpoint_auth_method?: string
  scope?: string
  redirect_uris?: string[]
  client_uri?: string
  example?: {
    name: string
    url: string
    repository: {
      url: string
    }
  }
  libraries?: Array<{
    name: string
    description?: string
    url: string
  }>
}

function parseCimdTemplate(
  doc: CimdTemplate,
  fallbackIdentifier: string,
): Template {
  const isSpa = doc.application_type === "spa"
  const appType = isSpa ? ApplicationTypes.spa : ApplicationTypes.webApplication

  const grantTypes: GrantTypes[] = isSpa
    ? [GrantTypes.authorizationCode, GrantTypes.pkce]
    : [GrantTypes.authorizationCode, GrantTypes.pkce, GrantTypes.refreshToken]

  const tokenEndpointAuthMethods: TokenEndpointAuthMethods[] = isSpa
    ? [TokenEndpointAuthMethods.none]
    : [
        TokenEndpointAuthMethods.clientSecretBasic,
        TokenEndpointAuthMethods.clientSecretPost,
      ]

  const scopes = doc.scope ? doc.scope.split(" ") : []

  return {
    name: doc.client_name,
    description: doc.description || "",
    identifier: doc.identifier || fallbackIdentifier,
    icon: {
      contentUrl: doc.logo_uri || "",
    },
    technologies: doc.keywords || [],
    example: doc.example,
    libraries: doc.libraries,
    client: {
      applicationType: appType,
      grantTypes,
      tokenEndpointAuthMethods,
      scopes,
    },
    clientId: doc.client_id,
  }
}

import adonisjsAppClient from "@/data/cimd/templates/adonisjs-app-client.json" with { type: "json" }
import angularSpaClient from "@/data/cimd/templates/angular-spa-client.json" with { type: "json" }
import astroAppClient from "@/data/cimd/templates/astro-app-client.json" with { type: "json" }
import codeigniterAppClient from "@/data/cimd/templates/codeigniter-app-client.json" with { type: "json" }
import dartSpaClient from "@/data/cimd/templates/dart-spa-client.json" with { type: "json" }
import dotnetWebAppClient from "@/data/cimd/templates/dotnet-web-app-client.json" with { type: "json" }
import elixirAppClient from "@/data/cimd/templates/elixir-app-client.json" with { type: "json" }
import elixirPhoenixAppClient from "@/data/cimd/templates/elixir-phoenix-app-client.json" with { type: "json" }
import elysiajsAppClient from "@/data/cimd/templates/elysiajs-app-client.json" with { type: "json" }
import encoretsAppClient from "@/data/cimd/templates/encorets-app-client.json" with { type: "json" }
import erlangAppClient from "@/data/cimd/templates/erlang-app-client.json" with { type: "json" }
import expressjsAppClient from "@/data/cimd/templates/expressjs-app-client.json" with { type: "json" }
import fastifyAppClient from "@/data/cimd/templates/fastify-app-client.json" with { type: "json" }
import flutterWebSpaClient from "@/data/cimd/templates/flutter-web-spa-client.json" with { type: "json" }
import golangAppClient from "@/data/cimd/templates/golang-app-client.json" with { type: "json" }
import golangBeegoAppClient from "@/data/cimd/templates/golang-beego-app-client.json" with { type: "json" }
import golangEchoAppClient from "@/data/cimd/templates/golang-echo-app-client.json" with { type: "json" }
import golangFiberAppClient from "@/data/cimd/templates/golang-fiber-app-client.json" with { type: "json" }
import golangGinAppClient from "@/data/cimd/templates/golang-gin-app-client.json" with { type: "json" }
import hapiAppClient from "@/data/cimd/templates/hapi-app-client.json" with { type: "json" }
import haskellAppClient from "@/data/cimd/templates/haskell-app-client.json" with { type: "json" }
import honoAppClient from "@/data/cimd/templates/hono-app-client.json" with { type: "json" }
import javaJhipsterAppClient from "@/data/cimd/templates/java-jhipster-app-client.json" with { type: "json" }
import javaPlayFrameworkAppClient from "@/data/cimd/templates/java-play-framework-app-client.json" with { type: "json" }
import javaSpringAppClient from "@/data/cimd/templates/java-spring-app-client.json" with { type: "json" }
import javaStrutsAppClient from "@/data/cimd/templates/java-struts-app-client.json" with { type: "json" }
import javaVaadinAppClient from "@/data/cimd/templates/java-vaadin-app-client.json" with { type: "json" }
import javaWebAppClient from "@/data/cimd/templates/java-web-app-client.json" with { type: "json" }
import koaAppClient from "@/data/cimd/templates/koa-app-client.json" with { type: "json" }
import kotlinWebAppClient from "@/data/cimd/templates/kotlin-web-app-client.json" with { type: "json" }
import laravelAppClient from "@/data/cimd/templates/laravel-app-client.json" with { type: "json" }
import litSpaClient from "@/data/cimd/templates/lit-spa-client.json" with { type: "json" }
import loopbackAppClient from "@/data/cimd/templates/loopback-app-client.json" with { type: "json" }
import meteorjsAppClient from "@/data/cimd/templates/meteorjs-app-client.json" with { type: "json" }
import nestjsAppClient from "@/data/cimd/templates/nestjs-app-client.json" with { type: "json" }
import nextjsAppClient from "@/data/cimd/templates/nextjs-app-client.json" with { type: "json" }
import nodejsAppClient from "@/data/cimd/templates/nodejs-app-client.json" with { type: "json" }
import nuxtAppClient from "@/data/cimd/templates/nuxt-app-client.json" with { type: "json" }
import phpAppClient from "@/data/cimd/templates/php-app-client.json" with { type: "json" }
import preactSpaClient from "@/data/cimd/templates/preact-spa-client.json" with { type: "json" }
import pythonAppClient from "@/data/cimd/templates/python-app-client.json" with { type: "json" }
import pythonDjangoAppClient from "@/data/cimd/templates/python-django-app-client.json" with { type: "json" }
import pythonFastapiAppClient from "@/data/cimd/templates/python-fastapi-app-client.json" with { type: "json" }
import pythonFlaskAppClient from "@/data/cimd/templates/python-flask-app-client.json" with { type: "json" }
import pythonFletAppClient from "@/data/cimd/templates/python-flet-app-client.json" with { type: "json" }
import pythonStarletteAppClient from "@/data/cimd/templates/python-starlette-app-client.json" with { type: "json" }
import quarkusAppClient from "@/data/cimd/templates/quarkus-app-client.json" with { type: "json" }
import qwikSpaClient from "@/data/cimd/templates/qwik-spa-client.json" with { type: "json" }
import reactSpaClient from "@/data/cimd/templates/react-spa-client.json" with { type: "json" }
import remixAppClient from "@/data/cimd/templates/remix-app-client.json" with { type: "json" }
import rubyAppClient from "@/data/cimd/templates/ruby-app-client.json" with { type: "json" }
import rubyRailsAppClient from "@/data/cimd/templates/ruby-rails-app-client.json" with { type: "json" }
import rustActixAppClient from "@/data/cimd/templates/rust-actix-app-client.json" with { type: "json" }
import rustAppClient from "@/data/cimd/templates/rust-app-client.json" with { type: "json" }
import rustAxumAppClient from "@/data/cimd/templates/rust-axum-app-client.json" with { type: "json" }
import rustRocketAppClient from "@/data/cimd/templates/rust-rocket-app-client.json" with { type: "json" }
import sailsjsAppClient from "@/data/cimd/templates/sailsjs-app-client.json" with { type: "json" }
import scalaAppClient from "@/data/cimd/templates/scala-app-client.json" with { type: "json" }
import sinatraAppClient from "@/data/cimd/templates/sinatra-app-client.json" with { type: "json" }
import solidSpaClient from "@/data/cimd/templates/solid-spa-client.json" with { type: "json" }
import spaClient from "@/data/cimd/templates/spa-client.json" with { type: "json" }
import svelteSpaClient from "@/data/cimd/templates/svelte-spa-client.json" with { type: "json" }
import swiftVaporWebAppClient from "@/data/cimd/templates/swift-vapor-web-app-client.json" with { type: "json" }
import swiftWebAppClient from "@/data/cimd/templates/swift-web-app-client.json" with { type: "json" }
import symfonyAppClient from "@/data/cimd/templates/symfony-app-client.json" with { type: "json" }
import vueSpaClient from "@/data/cimd/templates/vue-spa-client.json" with { type: "json" }
import wakuAppClient from "@/data/cimd/templates/waku-app-client.json" with { type: "json" }
import webAppClient from "@/data/cimd/templates/web-app-client.json" with { type: "json" }
import windevAppClient from "@/data/cimd/templates/windev-app-client.json" with { type: "json" }
import yiiAppClient from "@/data/cimd/templates/yii-app-client.json" with { type: "json" }
import zendFrameworkAppClient from "@/data/cimd/templates/zend-framework-app-client.json" with { type: "json" }

export const templates: Template[] = [
  parseCimdTemplate(adonisjsAppClient as CimdTemplate, "adonisjs-app"),
  parseCimdTemplate(angularSpaClient as CimdTemplate, "angular-spa"),
  parseCimdTemplate(astroAppClient as CimdTemplate, "astro-app"),
  parseCimdTemplate(codeigniterAppClient as CimdTemplate, "codeigniter-app"),
  parseCimdTemplate(dartSpaClient as CimdTemplate, "dart-spa"),
  parseCimdTemplate(dotnetWebAppClient as CimdTemplate, "dotnet-web-app"),
  parseCimdTemplate(elixirAppClient as CimdTemplate, "elixir-app"),
  parseCimdTemplate(elixirPhoenixAppClient as CimdTemplate, "elixir-phoenix-app"),
  parseCimdTemplate(elysiajsAppClient as CimdTemplate, "elysiajs-app"),
  parseCimdTemplate(encoretsAppClient as CimdTemplate, "encorets-app"),
  parseCimdTemplate(erlangAppClient as CimdTemplate, "erlang-app"),
  parseCimdTemplate(expressjsAppClient as CimdTemplate, "expressjs-app"),
  parseCimdTemplate(fastifyAppClient as CimdTemplate, "fastify-app"),
  parseCimdTemplate(flutterWebSpaClient as CimdTemplate, "flutter-web-spa"),
  parseCimdTemplate(golangAppClient as CimdTemplate, "golang-app"),
  parseCimdTemplate(golangBeegoAppClient as CimdTemplate, "golang-beego-app"),
  parseCimdTemplate(golangEchoAppClient as CimdTemplate, "golang-echo-app"),
  parseCimdTemplate(golangFiberAppClient as CimdTemplate, "golang-fiber-app"),
  parseCimdTemplate(golangGinAppClient as CimdTemplate, "golang-gin-app"),
  parseCimdTemplate(hapiAppClient as CimdTemplate, "hapi-app"),
  parseCimdTemplate(haskellAppClient as CimdTemplate, "haskell-app"),
  parseCimdTemplate(honoAppClient as CimdTemplate, "hono-app"),
  parseCimdTemplate(javaJhipsterAppClient as CimdTemplate, "java-jhipster-app"),
  parseCimdTemplate(javaPlayFrameworkAppClient as CimdTemplate, "java-play-framework-app"),
  parseCimdTemplate(javaSpringAppClient as CimdTemplate, "java-spring-app"),
  parseCimdTemplate(javaStrutsAppClient as CimdTemplate, "java-struts-app"),
  parseCimdTemplate(javaVaadinAppClient as CimdTemplate, "java-vaadin-app"),
  parseCimdTemplate(javaWebAppClient as CimdTemplate, "java-web-app"),
  parseCimdTemplate(koaAppClient as CimdTemplate, "koa-app"),
  parseCimdTemplate(kotlinWebAppClient as CimdTemplate, "kotlin-web-app"),
  parseCimdTemplate(laravelAppClient as CimdTemplate, "laravel-app"),
  parseCimdTemplate(litSpaClient as CimdTemplate, "lit-spa"),
  parseCimdTemplate(loopbackAppClient as CimdTemplate, "loopback-app"),
  parseCimdTemplate(meteorjsAppClient as CimdTemplate, "meteorjs-app"),
  parseCimdTemplate(nestjsAppClient as CimdTemplate, "nestjs-app"),
  parseCimdTemplate(nextjsAppClient as CimdTemplate, "nextjs-app"),
  parseCimdTemplate(nodejsAppClient as CimdTemplate, "nodejs-app"),
  parseCimdTemplate(nuxtAppClient as CimdTemplate, "nuxt-app"),
  parseCimdTemplate(phpAppClient as CimdTemplate, "php-app"),
  parseCimdTemplate(preactSpaClient as CimdTemplate, "preact-spa"),
  parseCimdTemplate(pythonAppClient as CimdTemplate, "python-app"),
  parseCimdTemplate(pythonDjangoAppClient as CimdTemplate, "python-django-app"),
  parseCimdTemplate(pythonFastapiAppClient as CimdTemplate, "python-fastapi-app"),
  parseCimdTemplate(pythonFlaskAppClient as CimdTemplate, "python-flask-app"),
  parseCimdTemplate(pythonFletAppClient as CimdTemplate, "python-flet-app"),
  parseCimdTemplate(pythonStarletteAppClient as CimdTemplate, "python-starlette-app"),
  parseCimdTemplate(quarkusAppClient as CimdTemplate, "quarkus-app"),
  parseCimdTemplate(qwikSpaClient as CimdTemplate, "qwik-spa"),
  parseCimdTemplate(reactSpaClient as CimdTemplate, "react-spa"),
  parseCimdTemplate(remixAppClient as CimdTemplate, "remix-app"),
  parseCimdTemplate(rubyAppClient as CimdTemplate, "ruby-app"),
  parseCimdTemplate(rubyRailsAppClient as CimdTemplate, "ruby-rails-app"),
  parseCimdTemplate(rustActixAppClient as CimdTemplate, "rust-actix-app"),
  parseCimdTemplate(rustAppClient as CimdTemplate, "rust-app"),
  parseCimdTemplate(rustAxumAppClient as CimdTemplate, "rust-axum-app"),
  parseCimdTemplate(rustRocketAppClient as CimdTemplate, "rust-rocket-app"),
  parseCimdTemplate(sailsjsAppClient as CimdTemplate, "sailsjs-app"),
  parseCimdTemplate(scalaAppClient as CimdTemplate, "scala-app"),
  parseCimdTemplate(sinatraAppClient as CimdTemplate, "sinatra-app"),
  parseCimdTemplate(solidSpaClient as CimdTemplate, "solid-spa"),
  parseCimdTemplate(spaClient as CimdTemplate, "spa"),
  parseCimdTemplate(svelteSpaClient as CimdTemplate, "svelte-spa"),
  parseCimdTemplate(swiftVaporWebAppClient as CimdTemplate, "swift-vapor-web-app"),
  parseCimdTemplate(swiftWebAppClient as CimdTemplate, "swift-web-app"),
  parseCimdTemplate(symfonyAppClient as CimdTemplate, "symfony-app"),
  parseCimdTemplate(vueSpaClient as CimdTemplate, "vue-spa"),
  parseCimdTemplate(wakuAppClient as CimdTemplate, "waku-app"),
  parseCimdTemplate(webAppClient as CimdTemplate, "web-app"),
  parseCimdTemplate(windevAppClient as CimdTemplate, "windev-app"),
  parseCimdTemplate(yiiAppClient as CimdTemplate, "yii-app"),
  parseCimdTemplate(zendFrameworkAppClient as CimdTemplate, "zend-framework-app"),
]
