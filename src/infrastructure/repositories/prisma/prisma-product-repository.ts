import { randomUUID } from 'crypto'

import { Category, Product } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { ProductRepository } from '@/domain/repositories'
import { prisma } from '@/infrastructure/database/prisma'
import { CategoryMapper, ProductMapper } from '@/shared/mappers'

export class PrismaProductRepository implements ProductRepository {
  async associateCategories(
    id: string,
    categoryIds: string[],
  ): Promise<Category[]> {
    await prisma.productOnCategory.createMany({
      data: categoryIds.map((categoryId) => {
        return {
          id: randomUUID(),
          category_id: categoryId,
          product_id: id,
        }
      }),
    })

    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: categoryIds,
        },
      },
      include: {
        department: true,
      },
    })

    return categories.map(CategoryMapper.toDomain)
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    })

    return ProductMapper.toDomain(product)
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Product>> {
    const [products, productsCount] = await prisma.$transaction([
      prisma.product.findMany({
        skip,
        take,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.product.count(),
    ])

    return {
      items: products.map(ProductMapper.toDomain),
      pagination: {
        count: productsCount,
        limit: take || productsCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(productsCount / take),
      },
    }
  }

  async paginateByCategory(
    categoryId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>> {
    const [products, productsCount] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          categories: {
            some: {
              category_id: categoryId,
            },
          },
        },
        skip,
        take,
      }),
      prisma.product.count({
        where: {
          categories: {
            some: {
              category_id: categoryId,
            },
          },
        },
      }),
    ])

    return {
      items: products.map(ProductMapper.toDomain),
      pagination: {
        count: productsCount,
        limit: take || productsCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(productsCount / take),
      },
    }
  }

  async paginateByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>> {
    const [products, productsCount] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          categories: {
            some: {
              category: {
                department_id: departmentId,
              },
            },
          },
        },
        skip,
        take,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          categories: {
            some: {
              category: {
                department_id: departmentId,
              },
            },
          },
        },
      }),
    ])

    return {
      items: products.map(ProductMapper.toDomain),
      pagination: {
        count: productsCount,
        limit: take || productsCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(productsCount / take),
      },
    }
  }

  async save(product: Product): Promise<Product> {
    const prismaProduct = ProductMapper.toPrisma(product)

    const createdProduct = await prisma.product.create({
      data: prismaProduct,
    })

    return ProductMapper.toDomain(createdProduct)
  }

  async update(product: Product): Promise<Product> {
    const prismaProduct = ProductMapper.toPrisma(product)

    const updatedProduct = await prisma.product.update({
      where: {
        id: prismaProduct.id,
      },
      data: prismaProduct,
    })

    return ProductMapper.toDomain(updatedProduct)
  }
}
