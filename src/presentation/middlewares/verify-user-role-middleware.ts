import { FastifyRequest, FastifyReply } from 'fastify'

import { UserRole } from '@/domain/enums'

export function verifyUserRole(allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (!allowedRoles.includes(role)) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
  }
}
