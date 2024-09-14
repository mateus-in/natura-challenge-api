import { FastifyRequest, FastifyReply } from 'fastify'

import { UserRole } from '@/domain/enums'

export function verifyUserRole(allowerdRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    if (!allowerdRoles.includes(role)) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }
  }
}
