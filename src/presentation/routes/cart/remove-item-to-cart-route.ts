import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { removeItemToCartUseCaseDependencyInjection } from '@/infrastructure/di'

export async function removeItemToCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    userId: z.string(),
    cartId: z.string(),
    cartItemId: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = removeItemToCartUseCaseDependencyInjection()

  const response = await useCase.execute({
    cartId: body.cartId,
    userId: body.userId,
    cartItemId: body.cartItemId,
  })

  return reply.status(200).send(response)
}
