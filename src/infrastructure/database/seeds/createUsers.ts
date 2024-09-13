import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export async function createUsers(prisma: PrismaClient) {
  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: `user${i + 1}@naturachallenge.com.br`,
        name: faker.person.firstName(),
        password_hash: 'naturachallengepass',
      },
    })

    await prisma.cart.create({
      data: {
        id: randomUUID(),
        user_id: user.id,
      },
    })
  }
}
