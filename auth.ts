import NextAuth from 'next-auth'

export const tokenIssuer = process.env.AUTH_CLIENT_ISSUER || 'https://oauth.cerberauth.com'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [{
    id: 'cerberauth',
    name: 'CerberAuth',
    issuer: tokenIssuer,
    type: 'oidc',
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    checks: ['pkce', 'state', 'nonce'],
    authorization: {
      params: { scope: 'openid profile email offline_access' }
    },
    idToken: true,
  }],
  session: { strategy: 'jwt' },
  callbacks: {
    signIn: async ({ account }) => {
      if (account?.provider === 'cerberauth') {
        return true
      }

      return false
    },
    jwt: ({ token, profile }) => {
      if (profile?.sub && profile?.email) {
        return {
          sub: profile.sub,
          name: profile.name,
          email: profile.email,
          picture: profile.picture,
        }
      }

      return token
    },
    session: async ({ session, token, user }) => {
      return {
        ...session,
        user: user ?? {
          id: token.sub,
          name: token.name,
          email: token.email,
          image: token.picture,
        },
      }
    },
  }
})
