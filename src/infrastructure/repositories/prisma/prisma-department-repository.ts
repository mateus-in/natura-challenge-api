import { Department } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { DepartmentRepository } from '@/domain/repositories'
import { prisma } from '@/infrastructure/database/prisma'
import { DepartmentMapper } from '@/shared/mappers'

export class PrismaDepartmentRepository implements DepartmentRepository {
  async findById(id: string): Promise<Department | null> {
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
    })

    if (!department) {
      return null
    }

    return DepartmentMapper.toDomain(department)
  }

  async findByName(name: string): Promise<Department | null> {
    const department = await prisma.department.findUnique({
      where: {
        name,
      },
    })

    if (!department) {
      return null
    }

    return DepartmentMapper.toDomain(department)
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Department>> {
    const [departments, departmentsCount] = await prisma.$transaction([
      prisma.department.findMany({
        skip,
        take,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.department.count(),
    ])

    return {
      items: departments.map(DepartmentMapper.toDomain),
      pagination: {
        count: departmentsCount,
        limit: take || departmentsCount,
        currentPage: Math.ceil((skip + 1) / take),
        pagesCount: Math.ceil(departmentsCount / take),
      },
    }
  }

  async save(department: Department): Promise<Department> {
    const prismaDepartment = DepartmentMapper.toPrisma(department)

    const newDepartment = await prisma.department.create({
      data: prismaDepartment,
    })

    return DepartmentMapper.toDomain(newDepartment)
  }

  async update(department: Department): Promise<Department> {
    const prismaDepartment = DepartmentMapper.toPrisma(department)

    const updatedDepartment = await prisma.department.update({
      where: {
        id: department.id,
      },
      data: prismaDepartment,
    })

    return DepartmentMapper.toDomain(updatedDepartment)
  }
}
