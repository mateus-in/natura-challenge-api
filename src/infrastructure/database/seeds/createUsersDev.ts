import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'

export async function createUsersDev(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      id: randomUUID(),
      email: 'dev@naturachallenge.com.br',
      name: 'Dev User',
      password_hash: await hash('naturachallengepass', 6),
      role: UserRole.DEV,
    },
  })
}
