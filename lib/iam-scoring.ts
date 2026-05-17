import { FeatureStatus } from '@/lib/types'

export type SurveyAnswers = {
  audience?: 'b2c' | 'b2b' | 'b2e' | 'mixed'
  mau?: '<1k' | '1k-10k' | '10k-100k' | '100k-1m' | '1m+'
  mauCount?: number
  deployment?: 'saas' | 'self_hosted' | 'flexible'
  features?: string[]
  compliance?: string[]
  budget?: 'free' | '<100' | '100-1000' | 'enterprise'
}

export type ScoreDimension = {
  dimension: string
  label: string
  score: number
  maxScore: number
}

export type VendorScore = {
  identifier: string
  score: number
  breakdown: ScoreDimension[]
  recommended: boolean
  topReasons: string[]
  estimatedPrice?: number | 'Custom' | 'Free'
}

function parseFreeTierLimit(limit?: string): number {
  if (!limit) return 0
  const match = limit.replace(/,/g, '').match(/(\d+)/)
  if (!match) return 0
  let val = parseInt(match[1], 10)
  if (limit.toLowerCase().includes('k')) val *= 1000
  if (limit.toLowerCase().includes('m')) val *= 1000000
  return val
}

function calculateEstimatedPrice(provider: Provider, mau: number): number | 'Custom' | 'Free' {
  if (!provider.pricing) return 'Custom'
  
  const { pricing } = provider
  if (pricing.hasFreeTier) {
    const limit = parseFreeTierLimit(pricing.freeTierLimit)
    if (limit > 0 && mau <= limit) return 'Free'
    if (!pricing.freeTierLimit && mau <= 1000) return 'Free' // Default assumption if not specified
  }

  // Look for the best matching plan
  // We'll look for $/MAU or fixed prices
  let bestPrice: number | null = null

  for (const plan of pricing.plans) {
    const priceStr = plan.price.toLowerCase()
    if (priceStr.includes('custom') || priceStr.includes('enterprise')) continue
    if (priceStr === 'free') continue

    // Match $/MAU (e.g. $0.02/MAU)
    const perMauMatch = plan.price.match(/\$([0-9.]+)\/MAU/i)
    if (perMauMatch) {
      const price = parseFloat(perMauMatch[1]) * mau
      if (bestPrice === null || price < bestPrice) bestPrice = price
      continue
    }

    // Match fixed price (e.g. $25/month)
    const fixedMatch = plan.price.match(/\$([0-9,.]+)\/month/i)
    if (fixedMatch) {
      const price = parseFloat(fixedMatch[1].replace(/,/g, ''))
      if (bestPrice === null || price < bestPrice) bestPrice = price
      continue
    }
  }

  if (bestPrice !== null) return Math.round(bestPrice)
  return 'Custom'
}

type Provider = {
  identifier: string
  license: string
  pricing?: {
    hasFreeTier: boolean
    freeTierLimit?: string
    plans: { name: string; price: string }[]
  }
  featureList: { identifier: string; status: string }[]
}

const VENDOR_DEPLOYMENT: Record<string, string[]> = {
  'auth0': ['saas'],
  'clerk': ['saas'],
  'firebase-auth': ['saas'],
  'keycloak': ['self_hosted', 'saas'],
  'fusionauth': ['saas', 'self_hosted'],
  'ory': ['saas', 'self_hosted'],
  'supertokens': ['saas', 'self_hosted'],
  'supabase-auth': ['saas', 'self_hosted'],
  'stytch': ['saas'],
  'aws-cognito': ['saas'],
  'microsoft-entra-id': ['saas'],
  'descope': ['saas'],
  'ping-identity': ['saas', 'self_hosted'],
}

const OPEN_SOURCE_LICENSES = ['MIT', 'Apache-2.0', 'Apache 2.0', 'AGPL-3.0', 'AGPL', 'BSL', 'SSPL']

function hasFeature(provider: Provider, featureId: string): boolean {
  const f = provider.featureList.find(x => x.identifier === featureId)
  return f?.status === FeatureStatus.Supported || f?.status === FeatureStatus.Partial
}

const MAX_PER_DIM = 20

export const COMMON_FEATURES = [
  'username_and_password_authentication',
  'totp_mfa',
  'recovery_code_mfa',
  'bulk_user_import',
  'bulk_user_export',
  'rbac',
  'password_strength_policy',
  'hosted_login_page',
  'sdk_coverage',
  'management_api',
  'custom_domain',
]

export const AUDIENCE_FEATURES: Record<string, string[]> = {
  b2c: ['social_sign_in_authentication', 'passkey_authentication', 'magic_link_authentication', 'email_passwordless_authentication', 'anonymous_authentication', 'progressive_profiling'],
  b2b: ['saml2_protocol', 'oidc_federation', 'saml_federation', 'per_org_branding', 'per_org_mfa_policy', 'organizations_multitenancy', 'inbound_scim_provisioning', 'jit_provisioning'],
  b2e: ['saml2_protocol', 'active_directory_ldap', 'adaptive_mfa', 'oidc_federation', 'saml_federation', 'ws_federation_protocol', 'audit_log_streaming'],
}

export const FEATURE_MAP: Record<string, string[]> = {
  enterprise_sso: ['saml2_protocol', 'saml_federation', 'oidc_federation'],
  passkeys: ['passkey_authentication'],
  social_login: ['social_sign_in_authentication'],
  passwordless: ['email_passwordless_authentication', 'magic_link_authentication'],
  adaptive_mfa: ['adaptive_mfa'],
  m2m: ['machine_to_machine'],
  custom_branding: ['universal_login_customization'],
}

export const COMPLIANCE_MAP: Record<string, string[]> = {
  soc2: ['soc2_type2'],
  gdpr: ['gdpr_data_export', 'gdpr_right_to_erasure'],
  hipaa: ['hipaa_baa'],
  fedramp: ['fedramp'],
  pci: ['pci_dss'],
  iso27001: ['iso_27001'],
}

function scoreAudience(provider: Provider, audience: SurveyAnswers['audience']): ScoreDimension {
  if (!audience) return { dimension: 'audience', label: 'Audience fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }

  let features: string[]
  let label: string
  if (audience === 'b2c') {
    features = AUDIENCE_FEATURES.b2c
    label = 'Consumer (B2C) fit'
  } else if (audience === 'b2b') {
    features = AUDIENCE_FEATURES.b2b
    label = 'Business (B2B) fit'
  } else if (audience === 'b2e') {
    features = AUDIENCE_FEATURES.b2e
    label = 'Workforce (B2E) fit'
  } else {
    // mixed: average of all three
    const allFeatures = [...new Set([...AUDIENCE_FEATURES.b2c, ...AUDIENCE_FEATURES.b2b, ...AUDIENCE_FEATURES.b2e])]
    const supported = allFeatures.filter(f => hasFeature(provider, f)).length
    const score = Math.round((supported / allFeatures.length) * MAX_PER_DIM)
    return { dimension: 'audience', label: 'Multi-audience fit', score, maxScore: MAX_PER_DIM }
  }

  const supported = features.filter(f => hasFeature(provider, f)).length
  const score = Math.round((supported / features.length) * MAX_PER_DIM)
  return { dimension: 'audience', label, score, maxScore: MAX_PER_DIM }
}

function scoreScale(provider: Provider, mau: SurveyAnswers['mau']): ScoreDimension {
  if (!mau) return { dimension: 'scale', label: 'Scale fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }

  const pricing = provider.pricing
  let score = MAX_PER_DIM

  if (mau === '<1k' || mau === '1k-10k') {
    // Small scale: reward free tier or affordable pricing
    if (!pricing) {
      score = 10
    } else if (pricing.hasFreeTier) {
      score = MAX_PER_DIM
    } else {
      // Has paid plans — check if any plan is affordable
      const hasAffordable = pricing.plans.some(p => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
        return !isNaN(price) && price <= 50
      })
      score = hasAffordable ? 16 : 10
    }
  } else if (mau === '10k-100k') {
    // Mid scale: free tier vendors may have hitting limits, prefer good mid-tier pricing
    if (!pricing) {
      score = 12
    } else if (pricing.hasFreeTier) {
      // Check if free tier limit is sufficient
      const limitStr = pricing.freeTierLimit || ''
      const limitMatch = limitStr.replace(/[^0-9]/g, '')
      const limit = parseInt(limitMatch, 10)
      score = (limit >= 10000) ? 18 : 14
    } else {
      score = 16
    }
  } else if (mau === '100k-1m') {
    // Large scale: self-hosted or enterprise plans are preferred
    const deploymentModels = VENDOR_DEPLOYMENT[provider.identifier] || ['saas']
    if (deploymentModels.includes('self_hosted')) {
      score = MAX_PER_DIM
    } else if (pricing?.plans.some(p => /enterprise|custom/i.test(p.name))) {
      score = 18
    } else {
      score = 12
    }
  } else if (mau === '1m+') {
    // Very large scale: strongly prefer self-hosted or enterprise contracts
    const deploymentModels = VENDOR_DEPLOYMENT[provider.identifier] || ['saas']
    if (deploymentModels.includes('self_hosted')) {
      score = MAX_PER_DIM
    } else if (['aws-cognito', 'microsoft-entra-id', 'ping-identity', 'auth0'].includes(provider.identifier)) {
      score = 18 // Known large-scale cloud providers
    } else if (pricing?.plans.some(p => /enterprise|custom/i.test(p.name))) {
      score = 14
    } else {
      score = 8
    }
  }

  return { dimension: 'scale', label: 'Scale fit', score, maxScore: MAX_PER_DIM }
}

function scoreDeployment(provider: Provider, deployment: SurveyAnswers['deployment']): ScoreDimension {
  if (!deployment || deployment === 'flexible') {
    return { dimension: 'deployment', label: 'Deployment fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }
  }

  const models = VENDOR_DEPLOYMENT[provider.identifier] || ['saas']
  const isMatch = models.includes(deployment)
  const isPartial = deployment === 'self_hosted' && models.includes('saas') && models.length > 1

  let score: number
  if (isMatch) {
    score = MAX_PER_DIM
  } else if (isPartial) {
    score = 12
  } else {
    score = 0
  }

  const label = deployment === 'saas' ? 'Cloud SaaS fit' : 'Self-hosted fit'
  return { dimension: 'deployment', label, score, maxScore: MAX_PER_DIM }
}

function scoreFeatures(provider: Provider, features: SurveyAnswers['features']): ScoreDimension {
  if (!features || features.length === 0) {
    return { dimension: 'features', label: 'Feature fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }
  }

  const required = features.flatMap(f => FEATURE_MAP[f] || [])
  if (required.length === 0) {
    return { dimension: 'features', label: 'Feature fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }
  }

  const supported = required.filter(f => hasFeature(provider, f)).length
  const score = Math.round((supported / required.length) * MAX_PER_DIM)
  return { dimension: 'features', label: 'Feature fit', score, maxScore: MAX_PER_DIM }
}

function scoreCompliance(provider: Provider, compliance: SurveyAnswers['compliance']): ScoreDimension {
  if (!compliance || compliance.length === 0) {
    return { dimension: 'compliance', label: 'Compliance fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }
  }

  const required = compliance.flatMap(c => COMPLIANCE_MAP[c] || [])
  if (required.length === 0) {
    return { dimension: 'compliance', label: 'Compliance fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }
  }

  const supported = required.filter(f => hasFeature(provider, f)).length
  const score = Math.round((supported / required.length) * MAX_PER_DIM)
  return { dimension: 'compliance', label: 'Compliance fit', score, maxScore: MAX_PER_DIM }
}

function scoreBudget(provider: Provider, budget: SurveyAnswers['budget']): ScoreDimension {
  if (!budget || budget === 'enterprise') {
    return { dimension: 'budget', label: 'Budget fit', score: MAX_PER_DIM, maxScore: MAX_PER_DIM }
  }

  const pricing = provider.pricing
  const isOpenSource = OPEN_SOURCE_LICENSES.some(l => provider.license.toLowerCase().includes(l.toLowerCase()))

  let score: number
  if (budget === 'free') {
    if (isOpenSource || (pricing?.hasFreeTier)) {
      score = MAX_PER_DIM
    } else {
      score = 0
    }
  } else if (budget === '<100') {
    if (pricing?.hasFreeTier) {
      score = MAX_PER_DIM
    } else if (pricing) {
      const hasAffordable = pricing.plans.some(p => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
        return !isNaN(price) && price <= 100
      })
      score = hasAffordable ? 18 : 8
    } else {
      score = 10
    }
  } else {
    // 100-1000
    if (pricing?.hasFreeTier) {
      score = MAX_PER_DIM
    } else if (pricing) {
      const hasInRange = pricing.plans.some(p => {
        const price = parseFloat(p.price.replace(/[^0-9.]/g, ''))
        return !isNaN(price) && price <= 1000
      })
      score = hasInRange ? MAX_PER_DIM : 10
    } else {
      score = 12
    }
  }

  return { dimension: 'budget', label: 'Budget fit', score, maxScore: MAX_PER_DIM }
}

function buildTopReasons(breakdown: ScoreDimension[], answers: SurveyAnswers): string[] {
  const reasons: string[] = []

  const highDims = breakdown.filter(d => d.score >= d.maxScore * 0.8).sort((a, b) => b.score - a.score)
  for (const dim of highDims.slice(0, 3)) {
    if (dim.dimension === 'audience' && dim.score > 14) {
      reasons.push(`Strong ${dim.label.toLowerCase()}`)
    } else if (dim.dimension === 'deployment' && answers.deployment && answers.deployment !== 'flexible') {
      reasons.push(`Supports ${answers.deployment === 'saas' ? 'cloud SaaS' : 'self-hosting'}`)
    } else if (dim.dimension === 'compliance' && answers.compliance?.length) {
      reasons.push(`Meets your compliance requirements`)
    } else if (dim.dimension === 'features' && answers.features?.length) {
      reasons.push(`All required capabilities supported`)
    } else if (dim.dimension === 'scale' && dim.score >= 18) {
      reasons.push(`Well-suited for your scale`)
    } else if (dim.dimension === 'budget' && dim.score >= 18) {
      reasons.push(`Fits your budget`)
    }
  }

  return reasons.slice(0, 3)
}

export function scoreVendors(providers: Provider[], answers: SurveyAnswers): VendorScore[] {
  const mauCount = answers.mauCount || (answers.mau === '<1k' ? 500 : answers.mau === '1k-10k' ? 5000 : answers.mau === '10k-100k' ? 50000 : answers.mau === '100k-1m' ? 500000 : answers.mau === '1m+' ? 1500000 : 0)

  const scores = providers.map(provider => {
    const breakdown: ScoreDimension[] = [
      scoreAudience(provider, answers.audience),
      scoreScale(provider, answers.mau),
      scoreDeployment(provider, answers.deployment),
      scoreFeatures(provider, answers.features),
      scoreCompliance(provider, answers.compliance),
      scoreBudget(provider, answers.budget),
    ]

    const total = breakdown.reduce((sum, d) => sum + d.score, 0)
    const maxTotal = breakdown.reduce((sum, d) => sum + d.maxScore, 0)
    const score = Math.round((total / maxTotal) * 100)

    return {
      identifier: provider.identifier,
      score,
      breakdown,
      recommended: false,
      topReasons: [] as string[],
      estimatedPrice: mauCount > 0 ? calculateEstimatedPrice(provider, mauCount) : undefined
    }
  })

  scores.sort((a, b) => b.score - a.score)

  // Mark top 3 as recommended and generate reasons
  scores.slice(0, 3).forEach((s, i) => {
    s.recommended = true
    s.topReasons = buildTopReasons(s.breakdown, answers)
    if (s.topReasons.length === 0) {
      s.topReasons = i === 0 ? ['Best overall match for your profile'] : [`#${i + 1} match for your profile`]
    }
  })

  return scores
}
