import { DepartmentService } from '@/application/services'

interface PaginateDepartmentsUseCaseParams {
  skip?: number
  take?: number
}

export class PaginateDepartmentsUseCase {
  constructor(private departmentService: DepartmentService) {}

  async execute(params: PaginateDepartmentsUseCaseParams) {
    const { skip, take } = params

    const departments = await this.departmentService.paginateDepartments(
      skip,
      take,
    )

    return {
      departments: departments.items.map((department) => {
        return {
          id: department.id,
          name: department.name,
          description: department.description,
        }
      }),
      pagination: {
        count: departments.pagination.count,
        limit: departments.pagination.limit,
        currentPage: departments.pagination.currentPage,
        pagesCount: departments.pagination.pagesCount,
      },
    }
  }
}
