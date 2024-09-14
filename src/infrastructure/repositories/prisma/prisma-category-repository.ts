import { Category } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { CategoryRepository } from '@/domain/repositories'
import { prisma } from '@/infrastructure/database/prisma'
import { CategoryMapper } from '@/shared/mappers'

export class PrismaCategoryRepository implements CategoryRepository {
  async findById(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
      include: {
        department: true,
      },
    })

    return CategoryMapper.toDomain(category)
  }

  async findManyByIds(ids: string[]): Promise<Category[]> {
    const category = await prisma.category.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        department: true,
      },
    })

    return category.map(CategoryMapper.toDomain)
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Category>> {
    const [categories, categoryCount] = await prisma.$transaction([
      prisma.category.findMany({
        skip,
        take,
        include: {
          department: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.category.count(),
    ])

    return {
      items: categories.map(CategoryMapper.toDomain),
      pagination: {
        count: categoryCount,
        limit: take || categoryCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(categoryCount / take),
      },
    }
  }

  async paginateByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Category>> {
    const [categories, categoriesCount] = await prisma.$transaction([
      prisma.category.findMany({
        where: {
          department_id: departmentId,
        },
        skip,
        take,
        include: {
          department: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.category.count({
        where: {
          department_id: departmentId,
        },
      }),
    ])

    return {
      items: categories.map(CategoryMapper.toDomain),
      pagination: {
        count: categoriesCount,
        limit: take || categoriesCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(categoriesCount / take),
      },
    }
  }

  async save(category: Category): Promise<Category> {
    const prismaCategory = CategoryMapper.toPrisma(category)

    const newCategory = await prisma.category.create({
      data: prismaCategory,
      include: {
        department: true,
      },
    })

    return CategoryMapper.toDomain(newCategory)
  }

  async update(category: Category): Promise<Category> {
    const prismaCategory = CategoryMapper.toPrisma(category)

    const updatedCategory = await prisma.category.update({
      where: {
        id: category.id,
      },
      data: prismaCategory,
      include: {
        department: true,
      },
    })

    return CategoryMapper.toDomain(updatedCategory)
  }
}
