import { FastifyRequest, FastifyReply } from 'fastify'

import { getAuthenticatedUserUseCaseDependencyInjection } from '@/infrastructure/di'

export async function getAuthenticatedUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = getAuthenticatedUserUseCaseDependencyInjection()

  const response = await useCase.execute({
    id: request.user.sub,
  })

  return reply.status(200).send(response)
}
