import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { paginateCategoriesUseCaseDependencyInjection } from '@/infrastructure/di'

export async function paginateCategories(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const querySchema = z.object({
    skip: z
      .string()
      .transform((skip) => (skip !== undefined ? Number(skip) : undefined)),
    take: z
      .string()
      .transform((take) => (take !== undefined ? Number(take) : undefined)),
  })

  const query = querySchema.parse(request.query)
  const useCase = paginateCategoriesUseCaseDependencyInjection()

  const response = await useCase.execute({
    skip: Number(query.skip),
    take: Number(query.take),
  })

  return reply.status(200).send(response)
}
