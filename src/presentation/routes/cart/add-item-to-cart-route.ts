import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { addItemToCartUseCaseDependencyInjection } from '@/infrastructure/di'

export async function addItemToCart(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    cartId: z.string(),
    productId: z.string(),
    quantity: z.string().transform((quantity) => Number(quantity)),
  })

  const body = bodySchema.parse(request.body)
  const useCase = addItemToCartUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: request.user.sub,
    cartId: body.cartId,
    productId: body.productId,
    quantity: body.quantity,
  })

  return reply.status(200).send(response)
}
