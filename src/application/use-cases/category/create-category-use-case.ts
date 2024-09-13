import { CategoryService, DepartmentService } from '@/application/services'
import { Category } from '@/domain/entities'

interface CreateCategoryUseCaseParams {
  name: string
  description: string
  departmentId: string
}

interface CreateCategoryUseCaseResponse {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(
    private categoryService: CategoryService,
    private departmentService: DepartmentService,
  ) {}

  async execute(
    params: CreateCategoryUseCaseParams,
  ): Promise<CreateCategoryUseCaseResponse> {
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
      category,
    }
  }
}
