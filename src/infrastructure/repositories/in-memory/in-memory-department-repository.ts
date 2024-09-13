import { Department } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { DepartmentRepository } from '@/domain/repositories'

export class InMemoryDepartmentRepository implements DepartmentRepository {
  public items: Department[] = []

  async findById(id: string): Promise<Department | null> {
    const department = this.items.find((item) => item.id === id)

    if (!department) {
      return null
    }

    return department
  }

  async findByName(name: string): Promise<Department | null> {
    const department = this.items.find((item) => item.name === name)

    if (!department) {
      return null
    }

    return department
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Department>> {
    skip = skip || 0
    take = take || this.items.length

    const items = this.items.slice(skip, skip + take)
    const count = this.items.length
    const pagesCount = Math.ceil(count / take)
    const currentPage = Math.ceil((skip + 1) / take)

    return {
      items,
      pagination: {
        count,
        limit: take,
        currentPage,
        pagesCount,
      },
    }
  }

  async save(department: Department): Promise<Department> {
    this.items.push(department)
    return department
  }

  async update(department: Department): Promise<Department> {
    const index = this.items.findIndex((item) => item.id === department.id)

    this.items[index] = department
    return department
  }
}
