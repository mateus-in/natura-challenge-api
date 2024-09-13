import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

export async function createProducts(
  prisma: PrismaClient,
  categoriesIds: string[],
) {
  for (let i = 0; i < 100; i++) {
    const categoriesQuantity = Math.floor(Math.random() * 3) + 1
    const shuffledCategoriesIds = categoriesIds.sort(() => 0.5 - Math.random())
    const randomCategoriesIds = shuffledCategoriesIds.slice(
      0,
      categoriesQuantity,
    )

    const product = await prisma.product.create({
      data: {
        id: randomUUID(),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.number.float({ min: 10, max: 500 }),
        stockQuantity: faker.number.int({ min: 1, max: 100 }),
      },
    })

    const productOnCategoryCreateManyData = randomCategoriesIds.map(
      (categoryId) => {
        return {
          id: randomUUID(),
          category_id: categoryId,
          product_id: product.id,
        }
      },
    )

    await prisma.productOnCategory.createMany({
      data: productOnCategoryCreateManyData,
    })
  }
}
