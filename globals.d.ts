import type { Session } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    token?: string
  }
}
