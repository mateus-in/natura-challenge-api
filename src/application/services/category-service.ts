import { Category, Department } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { CategoryRepository } from '@/domain/repositories'

interface CreateCategoryParams {
  name: string
  description: string
  department: Department
}

interface UpdateCategoryParams {
  name: string
  description: string
  department: Department
}

export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(params: CreateCategoryParams): Promise<Category> {
    const { name, description, department } = params

    return await this.categoryRepository.save(
      new Category({
        name,
        description,
        department,
      }),
    )
  }

  async findCategoryById(id: string): Promise<Category | null> {
    return await this.categoryRepository.findById(id)
  }

  async findManyCategoriesByIds(ids: string[]): Promise<Category[]> {
    return await this.categoryRepository.findManyByIds(ids)
  }

  async paginateCategories(
    skip?: number,
    take?: number,
  ): Promise<Paginate<Category>> {
    return await this.categoryRepository.paginate(skip, take)
  }

  async paginateCategoriesByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Category>> {
    return await this.categoryRepository.paginateByDepartment(
      departmentId,
      skip,
      take,
    )
  }

  async updateCategory(
    id: string,
    params: UpdateCategoryParams,
  ): Promise<Category> {
    const { name, description, department } = params

    const categoryToUpdate = await this.categoryRepository.findById(id)

    if (!categoryToUpdate) {
      throw new Error('Category not found')
    }

    categoryToUpdate.update({
      name,
      description,
      department,
    })

    return await this.categoryRepository.update(categoryToUpdate)
  }
}
