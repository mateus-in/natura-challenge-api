import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from '@/env'

export const app = fastify()

app.get('/', (_request, reply) => {
  return reply.send({
    message: 'natura-challenge-api',
  })
})

app.setErrorHandler((error, _request, reply) => {
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      error: error.format(),
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
    error: error.message,
  })
})
