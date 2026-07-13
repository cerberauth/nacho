import { FeatureStatus } from '@/lib/types'

export { FeatureStatus }

export enum IAMFeatureCategory {
  AuthenticationMethod = 'authentication_methods',
  MFA = 'mfa',
  IntegrationProtocols = 'integration_protocols',
  IdentityFederation = 'identity_federation',
  UserManagement = 'user_management',
  AccessControl = 'access_control',
  Security = 'security',
  MultiTenancy = 'multi_tenancy',
  BrandingUX = 'branding_ux',
  Analytics = 'analytics',
  Compliance = 'compliance',
  DeveloperIntegration = 'developer_integration',
  Advanced = 'advanced',
}

export type IAMFeature = {
  name: string
  identifier: string
  category: string
  description?: string
  tier?: string
  status: string
  links?: string[]
  values?: string[]
}

export type IAMPricingPlan = {
  name: string
  price: string
}

export type IAMPricing = {
  hasFreeTier: boolean
  freeTierLimit?: string
  pricingModel: string
  pricingUrl?: string
  plans: IAMPricingPlan[]
}

export type IAMProvider = {
  name: string
  abstract: string
  identifier: string
  website?: string
  github?: string
  icon: {
    contentUrl: string
  }
  license: string
  nationality?: string
  pricing?: IAMPricing
  featureList: Array<{
    identifier: string
    description?: string
    status: string
    links?: string[]
    values?: string[]
  }>
}

import iamFeatures from './features.json'

import auth0 from './auth0.json'
import authlete from './authlete.json'
import awsCognito from './aws-cognito.json'
import clerk from './clerk.json'
import curity from './curity.json'
import cyberark from './cyberark.json'
import microsoftEntraId from './microsoft-entra-id.json'
// import firebaseAuth from './firebase-auth.json'
import fusionauth from './fusionauth.json'
import kinde from './kinde.json'
import okta from './okta.json'
import keycloak from './keycloak.json'
import ory from './ory.json'
import pingIdentity from './ping-identity.json'
import sailpoint from './sailpoint.json'
import zitadel from './zitadel.json'
// import stytch from './stytch.json'
// import supabaseAuth from './supabase-auth.json'
// import supertokens from './supertokens.json'

export {
  iamFeatures,

  auth0,
  authlete,
  awsCognito,
  clerk,
  curity,
  cyberark,
  microsoftEntraId,
  // firebaseAuth,
  fusionauth,
  kinde,
  keycloak,
  okta,
  ory,
  pingIdentity,
  sailpoint,
  zitadel,
  // stytch,
  // supabaseAuth,
  // supertokens,
}

export const getFeaturesCategories = (dict: any) => [
  {
    name: dict.categories.authentication_methods,
    identifier: IAMFeatureCategory.AuthenticationMethod,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.AuthenticationMethod)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.mfa,
    identifier: IAMFeatureCategory.MFA,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.MFA)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.integration_protocols,
    identifier: IAMFeatureCategory.IntegrationProtocols,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.IntegrationProtocols)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.identity_federation,
    identifier: IAMFeatureCategory.IdentityFederation,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.IdentityFederation)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.user_management,
    identifier: IAMFeatureCategory.UserManagement,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.UserManagement)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.access_control,
    identifier: IAMFeatureCategory.AccessControl,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.AccessControl)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.security,
    identifier: IAMFeatureCategory.Security,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.Security)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.multi_tenancy,
    identifier: IAMFeatureCategory.MultiTenancy,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.MultiTenancy)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.branding_ux,
    identifier: IAMFeatureCategory.BrandingUX,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.BrandingUX)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.analytics,
    identifier: IAMFeatureCategory.Analytics,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.Analytics)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.compliance,
    identifier: IAMFeatureCategory.Compliance,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.Compliance)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.developer_integration,
    identifier: IAMFeatureCategory.DeveloperIntegration,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.DeveloperIntegration)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },

  {
    name: dict.categories.advanced,
    identifier: IAMFeatureCategory.Advanced,
    features: iamFeatures.featureList
      .filter((feature) => feature.category === IAMFeatureCategory.Advanced)
      .map((feature) => ({
        ...feature,
        name: dict.features?.[feature.identifier]?.name || feature.name,
        description: dict.features?.[feature.identifier]?.description || feature.description,
      })),
  },
]

export const providers: IAMProvider[] = [
  auth0,
  authlete,
  awsCognito,
  clerk,
  curity,
  cyberark,
  microsoftEntraId,
  // firebaseAuth,
  fusionauth,
  kinde,
  keycloak,
  okta,
  ory,
  pingIdentity,
  sailpoint,
  zitadel,
  // stytch,
  // supabaseAuth,
  // supertokens,
]
