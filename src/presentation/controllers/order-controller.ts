import { FastifyInstance } from 'fastify'

import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import { createOrder, paginateOrders } from '@/presentation/routes/order'

export async function orderController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get(
    '/orders',
    { onRequest: [verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    paginateOrders,
  )
  app.post(
    '/orders',
    { onRequest: [verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    createOrder,
  )
}
