import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { signUpUseCaseDependencyInjection } from '@/infrastructure/di'

export async function signUp(request: FastifyRequest, reply: FastifyReply) {
  const bodySchema = z.object({
    email: z.string(),
    name: z.string(),
    password: z.string(),
  })

  const body = bodySchema.parse(request.body)
  const useCase = signUpUseCaseDependencyInjection()

  const response = await useCase.execute({
    email: body.email,
    name: body.name,
    password: body.password,
  })

  return reply.status(201).send(response)
}
