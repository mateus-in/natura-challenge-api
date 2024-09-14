import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createProductUseCaseDependencyInjection } from '@/infrastructure/di'

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stockQuantity: z.number(),
    categoryIds: z.array(z.string()),
  })

  const body = bodySchema.parse(request.body)
  const useCase = createProductUseCaseDependencyInjection()

  const response = await useCase.execute({
    name: body.name,
    description: body.description,
    price: body.price,
    stockQuantity: body.stockQuantity,
    categoryIds: body.categoryIds,
  })

  return reply.status(201).send(response)
}
