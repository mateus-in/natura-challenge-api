import { PrismaClient, UserRole } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export async function createUsersDev(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      id: randomUUID(),
      email: 'dev@naturachallenge.com.br',
      name: 'Dev User',
      password_hash: 'naturachallengepass',
      role: UserRole.DEV,
    },
  })
}
