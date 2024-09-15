import { FastifyInstance } from 'fastify'

import { createOrderDocs, paginateOrdersDocs } from '@/docs/order'
import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import { createOrder, paginateOrders } from '@/presentation/routes/order'

export async function orderController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole([UserRole.ADMIN, UserRole.DEV]))

  app.get('/orders', { schema: paginateOrdersDocs }, paginateOrders)
  app.post('/orders', { schema: createOrderDocs }, createOrder)
}
