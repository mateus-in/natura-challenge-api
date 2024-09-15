import { FastifyInstance } from 'fastify'

import {
  createProductDocs,
  getProductDocs,
  paginateProductsDocs,
  updateProductDocs,
} from '@/docs/product'
import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  createProduct,
  getProduct,
  paginateProducts,
  updateProduct,
} from '@/presentation/routes/product'

export async function productController(app: FastifyInstance) {
  app.get('/products', { schema: paginateProductsDocs }, paginateProducts)

  app.get(
    '/products/:id',
    {
      schema: getProductDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    getProduct,
  )

  app.post(
    '/products',
    {
      schema: createProductDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    createProduct,
  )

  app.put(
    '/products/:id',
    {
      schema: updateProductDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    updateProduct,
  )
}
