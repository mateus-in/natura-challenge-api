import { FastifyInstance } from 'fastify'

import {
  createCategory,
  getCategory,
  paginateCategories,
  updateCategory,
} from '@/presentation/routes/category'

export async function categoryController(app: FastifyInstance) {
  app.post('/categories', createCategory)
  app.get('/categories', paginateCategories)
  app.get('/categories/:id', getCategory)
  app.put('/categories/:id', updateCategory)
}
