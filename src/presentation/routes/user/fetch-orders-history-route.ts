import { FastifyRequest, FastifyReply } from 'fastify'

import { fetchOrdersHistoryUseCaseDependencyInjection } from '@/infrastructure/di'

export async function fetchOrdersHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = fetchOrdersHistoryUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send(response)
}
