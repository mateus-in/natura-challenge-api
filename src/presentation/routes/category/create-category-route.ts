import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createCategoryUseCaseDependencyInjection } from '@/infrastructure/di'

export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    departmentId: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = createCategoryUseCaseDependencyInjection()

  const response = await useCase.execute({
    name: body.name,
    description: body.description,
    departmentId: body.departmentId,
  })

  return reply.status(201).send(response)
}
