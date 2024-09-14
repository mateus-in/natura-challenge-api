import { FastifyInstance } from 'fastify'

import { createOrder, paginateOrders } from '@/presentation/routes/order'

export async function orderController(app: FastifyInstance) {
  app.get('/orders', paginateOrders)
  app.post('/orders', createOrder)
}
