import { FastifyInstance } from 'fastify'

import {
  createDepartment,
  getDepartment,
  paginateDepartments,
  updateDepartment,
} from '@/presentation/routes/department'

export async function departmentController(app: FastifyInstance) {
  app.post('/departments', createDepartment)
  app.get('/departments', paginateDepartments)
  app.get('/departments/:id', getDepartment)
  app.put('/departments/:id', updateDepartment)
}
