import { FastifyInstance } from 'fastify'

import {
  fetchOrdersHistoryUserDocs,
  getAuthenticatedUserDocs,
  getUserDocs,
  refreshTokenDocs,
  signInDocs,
  signUpDocs,
} from '@/docs/user'
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
  app.post('/sign-in', { schema: signInDocs }, signIn)
  app.post('/sign-up', { schema: signUpDocs }, signUp)
  app.patch('/refresh-token', { schema: refreshTokenDocs }, refreshToken)

  app.get(
    '/me',
    {
      schema: getAuthenticatedUserDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.USER])],
    },
    getAuthenticatedUser,
  )

  app.get(
    '/users/orders-history',
    {
      schema: fetchOrdersHistoryUserDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.USER])],
    },
    fetchOrdersHistory,
  )

  app.get(
    '/users/:id',
    {
      schema: getUserDocs,
      onRequest: [verifyJwt, verifyUserRole([UserRole.ADMIN, UserRole.DEV])],
    },
    getUser,
  )
}
