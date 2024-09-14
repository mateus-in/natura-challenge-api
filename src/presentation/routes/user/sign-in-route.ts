import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { signInUseCaseDependencyInjection } from '@/infrastructure/di'

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = signInUseCaseDependencyInjection()

  const response = await useCase.execute({
    email: body.email,
    password: body.password,
  })

  return reply.status(200).send(response)
}
