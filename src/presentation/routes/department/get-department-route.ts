import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { getDepartmentUseCaseDependencyInjection } from '@/infrastructure/di'

export async function getDepartment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const params = paramsSchema.parse(request.params)
  const useCase = getDepartmentUseCaseDependencyInjection()

  const response = await useCase.execute({
    id: params.id,
  })

  return reply.status(200).send(response)
}
