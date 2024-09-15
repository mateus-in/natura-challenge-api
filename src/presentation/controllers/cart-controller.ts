import { FastifyInstance } from 'fastify'

import {
  addItemToCartDocs,
  clearCartDocs,
  removeItemToCartDocs,
  updateItemQuantityDocs,
} from '@/docs/cart'
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

  app.post('/carts/add-item', { schema: addItemToCartDocs }, addItemToCart)
  app.put('/carts/clear', { schema: clearCartDocs }, clearCart)

  app.put(
    '/carts/remove-item',
    { schema: removeItemToCartDocs },
    removeItemToCart,
  )

  app.put(
    '/carts/update-item-quantity',
    { schema: updateItemQuantityDocs },
    updateItemQuantity,
  )
}
