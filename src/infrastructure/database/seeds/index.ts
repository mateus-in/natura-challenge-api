import { PrismaClient } from '@prisma/client'

import { createCategories } from './createCategories'
import { createDepartments } from './createDepartments'
import { createProducts } from './createProducts'
import { createUsers } from './createUsers'
import { createUsersAdmin } from './createUsersAdmin'
import { createUsersDev } from './createUsersDev'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding users...')
  await createUsers(prisma)
  await createUsersAdmin(prisma)
  await createUsersDev(prisma)

  console.log('Seeding departments...')
  await createDepartments(prisma)

  console.log('Seeding categories...')
  const categories = await createCategories(prisma)
  const categoriesIds = categories.map((category) => category.id)

  console.log('Seeding products...')
  await createProducts(prisma, categoriesIds)

  console.log('Seeding is completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
