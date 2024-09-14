import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/presentation/middlewares/verify-jwt-middleware'
import { createOrder, paginateOrders } from '@/presentation/routes/order'

export async function orderController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/orders', paginateOrders)
  app.post('/orders', createOrder)
}
