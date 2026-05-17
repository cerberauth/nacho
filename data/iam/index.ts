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
import awsCognito from './aws-cognito.json'
import clerk from './clerk.json'
// import descope from './descope.json'
import microsoftEntraId from './microsoft-entra-id.json'
// import firebaseAuth from './firebase-auth.json'
import fusionauth from './fusionauth.json'
import keycloak from './keycloak.json'
import ory from './ory.json'
import pingIdentity from './ping-identity.json'
// import stytch from './stytch.json'
// import supabaseAuth from './supabase-auth.json'
// import supertokens from './supertokens.json'

export {
  iamFeatures,

  auth0,
  awsCognito,
  clerk,
  // descope,
  microsoftEntraId,
  // firebaseAuth,
  fusionauth,
  keycloak,
  ory,
  pingIdentity,
  // stytch,
  // supabaseAuth,
  // supertokens,
}

export const featuresCategories = [
  {
    name: 'Authentication Methods',
    identifier: IAMFeatureCategory.AuthenticationMethod,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.AuthenticationMethod),
  },

  {
    name: 'Multi-Factor Authentication (MFA)',
    identifier: IAMFeatureCategory.MFA,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.MFA),
  },

  {
    name: 'Integration Protocols',
    identifier: IAMFeatureCategory.IntegrationProtocols,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.IntegrationProtocols),
  },

  {
    name: 'Identity Federation',
    identifier: IAMFeatureCategory.IdentityFederation,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.IdentityFederation),
  },

  {
    name: 'User Management',
    identifier: IAMFeatureCategory.UserManagement,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.UserManagement),
  },

  {
    name: 'Access Control & Authorization',
    identifier: IAMFeatureCategory.AccessControl,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.AccessControl),
  },

  {
    name: 'Security',
    identifier: IAMFeatureCategory.Security,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.Security),
  },

  {
    name: 'Multi-Tenancy / Organizations',
    identifier: IAMFeatureCategory.MultiTenancy,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.MultiTenancy),
  },

  {
    name: 'Branding & UX',
    identifier: IAMFeatureCategory.BrandingUX,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.BrandingUX),
  },

  {
    name: 'Analytics & Audit',
    identifier: IAMFeatureCategory.Analytics,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.Analytics),
  },

  {
    name: 'Compliance',
    identifier: IAMFeatureCategory.Compliance,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.Compliance),
  },

  {
    name: 'Developer Integration',
    identifier: IAMFeatureCategory.DeveloperIntegration,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.DeveloperIntegration),
  },

  {
    name: 'Advanced / Differentiators',
    identifier: IAMFeatureCategory.Advanced,
    features: iamFeatures.featureList.filter(feature => feature.category === IAMFeatureCategory.Advanced),
  },
]

export const providers: IAMProvider[] = [
  auth0,
  awsCognito,
  clerk,
  // descope,
  microsoftEntraId,
  // firebaseAuth,
  fusionauth,
  keycloak,
  ory,
  pingIdentity,
  // stytch,
  // supabaseAuth,
  // supertokens,
]
