import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { getCategoryUseCaseDependencyInjection } from '@/infrastructure/di'

export async function getCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const params = paramsSchema.parse(request.params)
  const useCase = getCategoryUseCaseDependencyInjection()

  const response = await useCase.execute({
    id: params.id,
  })

  return reply.status(200).send(response)
}
