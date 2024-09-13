import { DepartmentService } from '@/application/services'
import { Department } from '@/domain/entities'

interface CreateDepartmentUseCaseParams {
  name: string
  description: string
}

interface CreateDepartmentUseCaseResponse {
  department: Department
}

export class CreateDepartmentUseCase {
  constructor(private departmentService: DepartmentService) {}

  async execute(
    params: CreateDepartmentUseCaseParams,
  ): Promise<CreateDepartmentUseCaseResponse> {
    const { name, description } = params

    const department = await this.departmentService.createDepartment({
      name,
      description,
    })

    return {
      department,
    }
  }
}
