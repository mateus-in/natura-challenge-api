import { CategoryService } from '@/application/services'
import { Category } from '@/domain/entities'

interface GetCategoryUseCaseParams {
  id: string
}

interface GetCategoryUseCaseResponse {
  category: Category
}

export class GetCategoryUseCase {
  constructor(private categoryService: CategoryService) {}

  async execute(
    params: GetCategoryUseCaseParams,
  ): Promise<GetCategoryUseCaseResponse> {
    const { id } = params

    const category = await this.categoryService.findCategoryById(id)

    if (!category) {
      throw new Error('Category not found')
    }

    return {
      category,
    }
  }
}
