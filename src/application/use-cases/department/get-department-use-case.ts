import { CategoryService, DepartmentService } from '@/application/services'

interface GetDepartmentUseCaseParams {
  id: string
}

export class GetDepartmentUseCase {
  constructor(
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
  ) {}

  async execute(params: GetDepartmentUseCaseParams) {
    const { id } = params

    const department = await this.departmentService.findDepartmentById(id)

    if (!department) {
      throw new Error('Department not found')
    }

    const categories =
      await this.categoryService.paginateCategoriesByDepartment(department.id)

    return {
      id: department.id,
      name: department.name,
      description: department.description,
      categories: categories.items.map((category) => {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
        }
      }),
    }
  }
}
