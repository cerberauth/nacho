import { z } from 'zod'
import { ApplicationTypes, GrantTypes, TokenEndpointAuthMethods } from '@/lib/consts'

const urlSchema = z.union([
  z.string().trim().url().startsWith('http://'),
  z.string().trim().url().startsWith('https://'),
], { errorMap: () => ({ message: 'URL must begin with http:// or https://' }) })
export const clientSchema = z.object({
  template: z.string().optional(),
  applicationType: z.enum(Object.values(ApplicationTypes) as [ApplicationType]),
  grantTypes: z.array(z.enum(Object.values(GrantTypes) as [GrantType])),
  tokenEndpointAuthMethod: z.enum(Object.values(TokenEndpointAuthMethods) as [TokenEndpointAuthMethod]),

  name: z.string(),
  uri: z.union([z.literal(''), urlSchema]).optional(),
  allowedCorsOrigins: z.array(z.string()).optional(),
  scopes: z.array(z.string()).optional(),
  audiences: z.array(z.string()).optional(),
  redirectUris: urlSchema.array().min(1, { message: 'At least one redirect URI is required' }),
  postLogoutRedirectUris: urlSchema.array().optional(),

  contacts: z.array(z.string()).optional(),
  policyUri: z.union([z.literal(''), urlSchema]).optional(),
  tosUri: z.union([z.literal(''), urlSchema]).optional(),
  logoUri: z.union([z.literal(''), urlSchema]).optional(),
})
