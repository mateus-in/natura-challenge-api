import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import fastifyJwt from '@fastify/jwt'
import { ZodError } from 'zod'

import { env } from '@/env'
import {
  cartController,
  categoryController,
  departmentController,
  orderController,
  productController,
  userController,
} from '@/presentation/controllers'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

// controllers
app.register(cartController)
app.register(categoryController)
app.register(departmentController)
app.register(orderController)
app.register(productController)
app.register(userController)

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
