import { FastifyInstance } from 'fastify'

import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  createProduct,
  getProduct,
  paginateProducts,
  updateProduct,
} from '@/presentation/routes/product'

export async function productController(app: FastifyInstance) {
  app.get('/products', paginateProducts)
  app.get('/products/:id', getProduct)

  app.post(
    '/products',
    { onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    createProduct,
  )

  app.put(
    '/products/:id',
    { onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    updateProduct,
  )
}
