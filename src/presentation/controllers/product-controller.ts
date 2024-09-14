import { FastifyInstance } from 'fastify'

import {
  createProduct,
  getProduct,
  paginateProducts,
  updateProduct,
} from '@/presentation/routes/product'

export async function productController(app: FastifyInstance) {
  app.post('/products', createProduct)
  app.get('/products', paginateProducts)
  app.get('/products/:id', getProduct)
  app.put('/products/:id', updateProduct)
}
