import { FastifyInstance } from 'fastify'

import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  addItemToCart,
  clearCart,
  removeItemToCart,
  updateItemQuantity,
} from '@/presentation/routes/cart'

export async function cartController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.addHook('onRequest', verifyUserRole([UserRole.USER]))

  app.post('/carts/add-item', addItemToCart)
  app.put('/carts/clear', clearCart)
  app.put('/carts/remove-item', removeItemToCart)
  app.put('/carts/update-item-quantity', updateItemQuantity)
}
