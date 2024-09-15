import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { Prisma } from '@prisma/client'
import fastify from 'fastify'
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
import { swaggerOptions, swaggerUiSchema } from '@/docs'

export const app = fastify()

app.register(fastifySwagger, swaggerOptions)
app.register(fastifySwaggerUi, swaggerUiSchema)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
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

  if (
    error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError
  ) {
    return reply.status(500).send({
      message: 'Database request error',
      error: error.message,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
    error: error.message,
  })
})
