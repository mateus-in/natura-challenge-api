import { CategoryService, DepartmentService } from '@/application/services'
import { Category } from '@/domain/entities'

interface UpdateCategoryUseCaseParams {
  id: string
  name: string
  description: string
  departmentId: string
}

interface UpdateCategoryUseCaseResponse {
  category: Category
}

export class UpdateCategoryUseCase {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly departmentService: DepartmentService,
  ) {}

  async execute(
    params: UpdateCategoryUseCaseParams,
  ): Promise<UpdateCategoryUseCaseResponse> {
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
      category,
    }
  }
}
