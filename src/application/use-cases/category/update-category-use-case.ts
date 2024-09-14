import { CategoryService, DepartmentService } from '@/application/services'

interface UpdateCategoryUseCaseParams {
  id: string
  name: string
  description: string
  departmentId: string
}

export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly departmentService: DepartmentService,
  ) {}

  async execute(params: UpdateCategoryUseCaseParams) {
    const { id, name, description, departmentId } = params

    const department =
      await this.departmentService.findDepartmentById(departmentId)

    if (!department) {
      throw new Error('Department not found')
    }

    const category = await this.categoryService.updateCategory(id, {
      name,
      description,
      department,
    })

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
