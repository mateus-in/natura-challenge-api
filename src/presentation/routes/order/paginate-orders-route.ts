import { FastifyRequest, FastifyReply } from 'fastify'

import { paginateOrdersUseCaseDependencyInjection } from '@/infrastructure/di'

export async function paginateOrders(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = paginateOrdersUseCaseDependencyInjection()

  const response = await useCase.execute({})

  return reply.status(200).send(response)
}
