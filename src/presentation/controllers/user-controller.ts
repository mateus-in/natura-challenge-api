import { FastifyInstance } from 'fastify'

import { UserRole } from '@/domain/enums'
import { verifyJwt, verifyUserRole } from '@/presentation/middlewares'
import {
  fetchOrdersHistory,
  getAuthenticatedUser,
  getUser,
  refreshToken,
  signIn,
  signUp,
} from '@/presentation/routes/user'

export async function userController(app: FastifyInstance) {
  app.post('/sign-in', signIn)
  app.post('/sign-up', signUp)
  app.patch('/refresh-token', refreshToken)

  app.get(
    '/me',
    { onRequest: [verifyJwt, verifyUserRole([UserRole.USER])] },
    getAuthenticatedUser,
  )

  app.get(
    '/users/orders-history',
    { onRequest: [verifyJwt, verifyUserRole([UserRole.USER])] },
    fetchOrdersHistory,
  )

  app.get(
    '/users/:id',
    {
      onRequest: [
        verifyJwt,
        verifyUserRole([UserRole.ADMIN, UserRole.DEV, UserRole.USER]),
      ],
    },
    getUser,
  )
}
