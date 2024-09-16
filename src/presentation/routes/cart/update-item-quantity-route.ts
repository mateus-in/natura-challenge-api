import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { updateItemQuantityUseCaseDependencyInjection } from '@/infrastructure/di'

export async function updateItemQuantity(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    cartId: z.string(),
    cartItemId: z.string(),
    quantity: z.string().transform((quantity) => Number(quantity)),
  })

  const body = bodySchema.parse(request.body)
  const useCase = updateItemQuantityUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: request.user.sub,
    cartId: body.cartId,
    cartItemId: body.cartItemId,
    quantity: body.quantity,
  })

  return reply.status(200).send(response)
}
