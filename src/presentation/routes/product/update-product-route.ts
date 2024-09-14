import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { updateProductUseCaseDependencyInjection } from '@/infrastructure/di'

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string(),
  })

  const bodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stockQuantity: z.number(),
  })

  const params = paramsSchema.parse(request.params)
  const body = bodySchema.parse(request.body)
  const useCase = updateProductUseCaseDependencyInjection()

  const response = await useCase.execute({
    id: params.id,
    name: body.name,
    description: body.description,
    price: body.price,
    stockQuantity: body.stockQuantity,
  })

  return reply.status(200).send(response)
}
