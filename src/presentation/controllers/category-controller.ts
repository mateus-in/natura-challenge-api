import { FastifyInstance } from 'fastify'

import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  createCategory,
  getCategory,
  paginateCategories,
  updateCategory,
} from '@/presentation/routes/category'

export async function categoryController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/categories', paginateCategories)

  app.post(
    '/categories',
    { onRequest: verifyUserRole([UserRole.ADMIN, UserRole.DEV]) },
    createCategory,
  )

  app.get(
    '/categories/:id',
    { onRequest: verifyUserRole([UserRole.ADMIN, UserRole.DEV]) },
    getCategory,
  )

  app.put(
    '/categories/:id',
    { onRequest: verifyUserRole([UserRole.ADMIN, UserRole.DEV]) },
    updateCategory,
  )
}
