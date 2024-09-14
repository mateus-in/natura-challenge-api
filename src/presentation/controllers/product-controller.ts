import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/presentation/middlewares/verify-jwt-middleware'
import {
  createProduct,
  getProduct,
  paginateProducts,
  updateProduct,
} from '@/presentation/routes/product'

export async function productController(app: FastifyInstance) {
  app.post('/products', { onRequest: [verifyJwt] }, createProduct)
  app.get('/products', paginateProducts)
  app.get('/products/:id', getProduct)
  app.put('/products/:id', { onRequest: [verifyJwt] }, updateProduct)
}
