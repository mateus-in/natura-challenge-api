import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { updateCategoryUseCaseDependencyInjection } from '@/infrastructure/di'

export async function updateCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    departmentId: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const params = paramsSchema.parse(request.params)

  const useCase = updateCategoryUseCaseDependencyInjection()

  const response = await useCase.execute({
    id: params.id,
    name: body.name,
    description: body.description,
    departmentId: body.departmentId,
  })

  return reply.status(200).send(response)
}
