export enum FeatureStatus {
  Supported = 'supported',
  NotSupported = 'not_supported',
  Partial = 'partial',
  Deprecated = 'deprecated',
  Unknown = 'unknown'
}

export type OpenIDConnectProvider = {
  name: string
  abstract: string
  identifier: string
  website?: string
  github?: string
  icon: {
    contentUrl: string
  }
  license: string
  featureList: Array<{
    identifier: string
    description?: string
    status: string
    url?: string
  }>
}

import openIDConnectFeatures from './features.json'

import auth0 from './auth0.json'
import keycloak from './keycloak.json'
import microsoftEntraID from './microsoft-entra-id.json'
import okta from './okta.json'
import oryHydra from './ory-hydra.json'
import pingIdentity from './ping-identity.json'

export {
  openIDConnectFeatures,

  auth0,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
}

export const providers: OpenIDConnectProvider[] = [
  auth0,
  keycloak,
  microsoftEntraID,
  okta,
  oryHydra,
  pingIdentity,
]
