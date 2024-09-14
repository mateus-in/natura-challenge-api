import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { getUserUseCaseDependencyInjection } from '@/infrastructure/di'

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const params = paramsSchema.parse(request.params)
  const useCase = getUserUseCaseDependencyInjection()

  const response = await useCase.execute({
    id: params.id,
  })

  return reply.status(200).send(response)
}
