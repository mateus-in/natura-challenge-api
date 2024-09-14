import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createDepartmentUseCaseDependencyInjection } from '@/infrastructure/di'

export async function createDepartment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = createDepartmentUseCaseDependencyInjection()

  const response = await useCase.execute({
    name: body.name,
    description: body.description,
  })

  return reply.status(201).send(response)
}
