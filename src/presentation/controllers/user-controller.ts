import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/presentation/middlewares/verify-jwt-middleware'
import {
  fetchOrdersHistory,
  getUser,
  signIn,
  signUp,
} from '@/presentation/routes/user'

export async function userController(app: FastifyInstance) {
  app.get('/users/:id/orders', { onRequest: [verifyJwt] }, fetchOrdersHistory)
  app.get('/users/:id', { onRequest: [verifyJwt] }, getUser)
  app.post('/sign-in', signIn)
  app.post('/sign-up', signUp)
}
