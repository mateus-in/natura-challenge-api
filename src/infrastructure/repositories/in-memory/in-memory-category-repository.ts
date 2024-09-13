import { Category } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { CategoryRepository } from '@/domain/repositories'

export class InMemoryCategoryRepository implements CategoryRepository {
  public items: Category[] = []

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id === id)

    if (!category) {
      return null
    }

    return category
  }

  async findManyByIds(ids: string[]): Promise<Category[]> {
    return this.items.filter((item) => ids.includes(item.id))
  }

  async paginate(skip?: number, take?: number): Promise<Paginate<Category>> {
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

  async paginateByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Category>> {
    const departmentCategories = this.items.filter(
      (item) => item.department.id === departmentId,
    )

    skip = skip || 0
    take = take || departmentCategories.length

    const items = departmentCategories.slice(skip, skip + take)
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

  async save(category: Category): Promise<Category> {
    this.items.push(category)
    return category
  }

  async update(category: Category): Promise<Category> {
    const index = this.items.findIndex((item) => item.id === category.id)

    this.items[index] = category
    return category
  }
}
