import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { clearCartUseCaseDependencyInjection } from '@/infrastructure/di'

export async function clearCart(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    userId: z.string(),
    cartId: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = clearCartUseCaseDependencyInjection()

  const response = await useCase.execute({
    userId: body.userId,
    cartId: body.cartId,
  })

  return reply.status(200).send(response)
}
