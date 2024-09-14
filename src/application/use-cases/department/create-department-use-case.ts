import { DepartmentService } from '@/application/services'

interface CreateDepartmentUseCaseParams {
  name: string
  description: string
}

export class CreateDepartmentUseCase {
  constructor(private departmentService: DepartmentService) {}

  async execute(params: CreateDepartmentUseCaseParams) {
    const { name, description } = params

    const department = await this.departmentService.createDepartment({
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
