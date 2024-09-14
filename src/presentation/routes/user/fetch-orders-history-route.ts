import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { fetchOrdersHistoryUseCaseDependencyInjection } from '@/infrastructure/di'

export async function fetchOrdersHistory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const params = paramsSchema.parse(request.params)
  const useCase = fetchOrdersHistoryUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: params.id,
  })

  return reply.status(200).send(response)
}
