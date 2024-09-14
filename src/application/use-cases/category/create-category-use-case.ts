import { CategoryService, DepartmentService } from '@/application/services'

interface CreateCategoryUseCaseParams {
  name: string
  description: string
  departmentId: string
}

export class CreateCategoryUseCase {
  constructor(
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
  ) {}

  async execute(params: CreateCategoryUseCaseParams) {
    const { name, description, departmentId } = params

    const department =
      await this.departmentService.findDepartmentById(departmentId)

    if (!department) {
      throw new Error('Department not found')
    }

    const category = await this.categoryService.createCategory({
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
