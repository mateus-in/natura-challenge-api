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

  const { user } = await useCase.execute({
    email: body.email,
    password: body.password,
  })

  const token = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    },
  )

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .status(200)
    .send({
      token,
    })
}
