import { FastifyInstance } from 'fastify'

import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  createDepartment,
  getDepartment,
  paginateDepartments,
  updateDepartment,
} from '@/presentation/routes/department'

export async function departmentController(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/departments', paginateDepartments)

  app.post(
    '/departments',
    { onRequest: [verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    createDepartment,
  )

  app.get(
    '/departments/:id',
    { onRequest: [verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    getDepartment,
  )

  app.put(
    '/departments/:id',
    { onRequest: [verifyUserRole([UserRole.ADMIN, UserRole.DEV])] },
    updateDepartment,
  )
}
