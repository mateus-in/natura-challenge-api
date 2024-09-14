import { FastifyInstance } from 'fastify'

import {
  fetchOrdersHistory,
  getUser,
  signIn,
  signUp,
} from '@/presentation/routes/user'

export async function userController(app: FastifyInstance) {
  app.get('/users/:id/orders', fetchOrdersHistory)
  app.get('/users/:id', getUser)
  app.post('/sign-in', signIn)
  app.post('/sign-up', signUp)
}
