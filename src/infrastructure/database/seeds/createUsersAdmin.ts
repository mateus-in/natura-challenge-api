import { PrismaClient, UserRole } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export async function createUsersAdmin(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      id: randomUUID(),
      email: 'admin@naturachallenge.com.br',
      name: 'Admin User',
      password_hash: 'naturachallengepass',
      role: UserRole.ADMIN,
    },
  })
}
