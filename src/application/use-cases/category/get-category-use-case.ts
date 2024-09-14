import { CategoryService } from '@/application/services'

interface GetCategoryUseCaseParams {
  id: string
}

export class GetCategoryUseCase {
  constructor(private categoryService: CategoryService) {}

  async execute(params: GetCategoryUseCaseParams) {
    const { id } = params

    const category = await this.categoryService.findCategoryById(id)

    if (!category) {
      throw new Error('Category not found')
    }

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      department: {
        id: category.department.id,
        name: category.department.name,
      },
    }
  }
}
