import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { paginateProductsUseCaseDependencyInjection } from '@/infrastructure/di'

export async function paginateProducts(
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
  const useCase = paginateProductsUseCaseDependencyInjection()

  const response = await useCase.execute({
    skip: query.skip,
    take: query.take,
  })

  return reply.status(200).send(response)
}
