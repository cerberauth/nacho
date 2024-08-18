import NextAuth from 'next-auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [{
    id: 'cerberauth',
    name: 'CerberAuth',
    issuer: 'https://oauth.cerberauth.com',
    type: 'oidc',
    clientId: process.env.AUTH_CLIENT_ID,
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    checks: ['pkce', 'state'],
    authorization: {
      params: { scope: 'openid profile email dynamic-client:write' }
    },
  }],
  session: { strategy: 'jwt' },
  callbacks: {
    signIn: async ({ account }) => {
      if (account?.provider === 'cerberauth') {
        return true
      }

      return false
    },
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        token.accessToken = account.access_token
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
        token: token.accessToken,
      }
    },
  }
})
