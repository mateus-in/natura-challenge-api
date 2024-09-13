import { CategoryService, DepartmentService } from '@/application/services'
import { Category } from '@/domain/entities'

interface GetDepartmentUseCaseParams {
  id: string
}

interface GetDepartmentUseCaseResponse {
  department: {
    id: string
    name: string
    description: string
    categories: Category[]
  }
}

export class GetDepartmentUseCase {
  constructor(
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
  ) {}

  async execute(
    params: GetDepartmentUseCaseParams,
  ): Promise<GetDepartmentUseCaseResponse> {
    const { id } = params

    const department = await this.departmentService.findDepartmentById(id)

    if (!department) {
      throw new Error('Department not found')
    }

    const categories =
      await this.categoryService.paginateCategoriesByDepartment(department.id)

    return {
      department: {
        id: department.id,
        name: department.name,
        description: department.description,
        categories: categories.items,
      },
    }
  }
}
