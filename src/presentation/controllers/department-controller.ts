import { FastifyInstance } from 'fastify'

import {
  createDepartmentDocs,
  getDepartmentDocs,
  paginateDepartmentsDocs,
  updateDepartmentDocs,
} from '@/docs/departments'
import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  createDepartment,
  getDepartment,
  paginateDepartments,
  updateDepartment,
} from '@/presentation/routes/department'

export async function departmentController(app: FastifyInstance) {
  app.get(
    '/departments',
    { schema: paginateDepartmentsDocs },
    paginateDepartments,
  )

  app.get(
    '/departments/:id',
    {
      schema: getDepartmentDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    getDepartment,
  )

  app.post(
    '/departments',
    {
      schema: createDepartmentDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    createDepartment,
  )

  app.put(
    '/departments/:id',
    {
      schema: updateDepartmentDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    updateDepartment,
  )
}
