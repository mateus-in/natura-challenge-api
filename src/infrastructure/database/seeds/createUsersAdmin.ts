import { PrismaClient, UserRole } from '@prisma/client'
import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'

export async function createUsersAdmin(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      id: randomUUID(),
      email: 'admin@naturachallenge.com.br',
      name: 'Admin User',
      password_hash: await hash('naturachallengepass', 6),
      role: UserRole.ADMIN,
    },
  })
}
