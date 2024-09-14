import { CategoryService } from '@/application/services'

interface PaginateCategoriesUseCaseParams {
  skip?: number
  take?: number
}

export class PaginateCategoriesUseCase {
  constructor(private readonly categoryService: CategoryService) {}

  async execute(params: PaginateCategoriesUseCaseParams) {
    const { skip, take } = params

    const categories = await this.categoryService.paginateCategories(skip, take)

    return {
      categories: categories.items.map((category) => {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          department: {
            id: category.department.id,
            name: category.department.name,
          },
        }
      }),
      pagination: {
        count: categories.pagination.count,
        limit: categories.pagination.limit,
        currentPage: categories.pagination.currentPage,
        pagesCount: categories.pagination.pagesCount,
      },
    }
  }
}
