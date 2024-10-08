import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { removeItemToCartUseCaseDependencyInjection } from '@/infrastructure/di'

export async function removeItemToCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    cartId: z.string(),
    cartItemId: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = removeItemToCartUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: request.user.sub,
    cartId: body.cartId,
    cartItemId: body.cartItemId,
  })

  return reply.status(200).send(response)
}
