import { FastifyInstance } from 'fastify'

import {
  createCategoryDocs,
  getCategoryDocs,
  paginateCategoriesDocs,
  updateCategoryDocs,
} from '@/docs/categories'
import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  createCategory,
  getCategory,
  paginateCategories,
  updateCategory,
} from '@/presentation/routes/category'

export async function categoryController(app: FastifyInstance) {
  app.get('/categories', { schema: paginateCategoriesDocs }, paginateCategories)

  app.get(
    '/categories/:id',
    {
      schema: getCategoryDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    getCategory,
  )

  app.post(
    '/categories',
    {
      schema: createCategoryDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    createCategory,
  )

  app.put(
    '/categories/:id',
    {
      schema: updateCategoryDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    updateCategory,
  )
}
