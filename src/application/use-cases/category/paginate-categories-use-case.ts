import { CategoryService } from '@/application/services'
import { Category } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

interface PaginateCategoriesUseCaseParams {
  skip?: number
  take?: number
}

interface PaginateCategoriesUseCaseResponse {
  categories: Paginate<Category>
}

export class PaginateCategoriesUseCase {
  constructor(private readonly categoryService: CategoryService) {}

  async execute(
    params: PaginateCategoriesUseCaseParams,
  ): Promise<PaginateCategoriesUseCaseResponse> {
    const { skip, take } = params

    const categories = await this.categoryService.paginateCategories(skip, take)

    return {
      categories,
    }
  }
}
