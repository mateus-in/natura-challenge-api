import { FastifyInstance } from 'fastify'

import {
  addItemToCart,
  clearCart,
  removeItemToCart,
  updateItemQuantity,
} from '@/presentation/routes/cart'

export async function cartController(app: FastifyInstance) {
  app.post('/carts/add-item', addItemToCart)
  app.put('/carts/clear', clearCart)
  app.put('/carts/remove-item', removeItemToCart)
  app.put('/carts/update-item-quantity', updateItemQuantity)
}
