import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/presentation/middlewares/verify-jwt-middleware'
import {
  createDepartment,
  getDepartment,
  paginateDepartments,
  updateDepartment,
} from '@/presentation/routes/department'

export async function departmentController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.post('/departments', createDepartment)
  app.get('/departments', paginateDepartments)
  app.get('/departments/:id', getDepartment)
  app.put('/departments/:id', updateDepartment)
}
