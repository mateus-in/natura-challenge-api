import {
  Category as PrismaCategory,
  Department as PrismaDepartment,
} from '@prisma/client'

import { Category } from '@/domain/entities'
import { DepartmentMapper } from '@/shared/mappers'

export class CategoryMapper {
  static toDomain(
    prismaCategory: PrismaCategory & {
      department: PrismaDepartment
    },
  ): Category {
    return new Category(
      {
        name: prismaCategory.name,
        description: prismaCategory.description,
        department: DepartmentMapper.toDomain(prismaCategory.department),
      },
      prismaCategory.id,
    )
  }

  static toPrisma(category: Category): PrismaCategory {
    return {
      id: category.id,
      department_id: category.department.id,
      name: category.name,
      description: category.description,
    }
  }
}
