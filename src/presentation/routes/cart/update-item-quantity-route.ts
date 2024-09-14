import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { updateItemQuantityUseCaseDependencyInjection } from '@/infrastructure/di'

export async function updateItemQuantity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    userId: z.string(),
    cartId: z.string(),
    cartItemId: z.string(),
    quantity: z.number(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = updateItemQuantityUseCaseDependencyInjection()

  const response = await useCase.execute({
    cartId: body.cartId,
    userId: body.userId,
    cartItemId: body.cartItemId,
    quantity: body.quantity,
  })

  return reply.status(200).send(response)
}
