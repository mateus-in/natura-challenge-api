import '@fastify/jwt'

import { UserRole } from '@/domain/enums'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      role: UserRole
      sub: string
    }
  }
}
