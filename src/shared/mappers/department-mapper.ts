import { Department as PrismaDepartment } from '@prisma/client'

import { Department } from '@/domain/entities'

export class DepartmentMapper {
  static toDomain(prismaDepartment: PrismaDepartment): Department {
    return new Department(
      {
        name: prismaDepartment.name,
        description: prismaDepartment.description,
      },
      prismaDepartment.id,
    )
  }

  static toPrisma(department: Department): PrismaDepartment {
    return {
      id: department.id,
      name: department.name,
      description: department.description,
    }
  }
}
