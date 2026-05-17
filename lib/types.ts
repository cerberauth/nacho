export enum FeatureStatus {
  Supported = 'supported',
  NotSupported = 'not_supported',
  Partial = 'partial',
  Deprecated = 'deprecated',
  Planned = 'planned',
  Unknown = 'unknown'
}

export type PricingPlan = {
  name: string
  price: string
}

export type Pricing = {
  hasFreeTier: boolean
  freeTierLimit?: string
  pricingModel: string
  pricingUrl?: string
  plans: PricingPlan[]
}

export type Feature = {
  name: string
  identifier: string
  description?: string
  status?: string
  links?: string[]
}

export type FeatureCategory = {
  name: string
  identifier: string
  features: Feature[]
}

export type ProviderFeature = {
  identifier: string
  description?: string
  status: string
  links?: string[]
  values?: string[]
}

export type Provider = {
  name: string
  identifier: string
  abstract?: string
  website?: string
  icon?: {
    contentUrl: string
  }
  license: string
  nationality?: string
  pricing?: Pricing
  featureList: ProviderFeature[]
}
