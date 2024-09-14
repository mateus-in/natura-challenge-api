import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/presentation/middlewares/verify-jwt-middleware'
import {
  createCategory,
  getCategory,
  paginateCategories,
  updateCategory,
} from '@/presentation/routes/category'

export async function categoryController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/categories', createCategory)
  app.get('/categories', paginateCategories)
  app.get('/categories/:id', getCategory)
  app.put('/categories/:id', updateCategory)
}
