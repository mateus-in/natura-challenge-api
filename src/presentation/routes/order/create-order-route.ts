import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { createOrderUseCaseDependencyInjection } from '@/infrastructure/di'

export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    cartId: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = createOrderUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: request.user.sub,
    cartId: body.cartId,
  })

  return reply.status(200).send(response)
}
