import { DepartmentService } from '@/application/services'
import { Department } from '@/domain/entities'

interface UpdateDepartmentUseCaseParams {
  id: string
  name: string
  description: string
}

interface UpdateDepartmentUseCaseResponse {
  department: Department
}

export class UpdateDepartmentUseCase {
  constructor(private departmentService: DepartmentService) {}

  async execute(
    params: UpdateDepartmentUseCaseParams,
  ): Promise<UpdateDepartmentUseCaseResponse> {
    const { id, name, description } = params

    const department = await this.departmentService.updateDepartment(id, {
      name,
      description,
    })

    return {
      department,
    }
  }
}
