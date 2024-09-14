import { DepartmentService } from '@/application/services'

interface UpdateDepartmentUseCaseParams {
  id: string
  name: string
  description: string
}

export class UpdateDepartmentUseCase {
  constructor(private departmentService: DepartmentService) {}

  async execute(params: UpdateDepartmentUseCaseParams) {
    const { id, name, description } = params

    const department = await this.departmentService.updateDepartment(id, {
      name,
      description,
    })

    return {
      id: department.id,
      name: department.name,
      description: department.description,
    }
  }
}
