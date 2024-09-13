import { DepartmentService } from '@/application/services'
import { Department } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

interface PaginateDepartmentsUseCaseParams {
  skip?: number
  take?: number
}

interface PaginateDepartmentsUseCaseResponse {
  departments: Paginate<Department>
}

export class PaginateDepartmentsUseCase {
  constructor(private departmentService: DepartmentService) {}

  async execute(
    params: PaginateDepartmentsUseCaseParams,
  ): Promise<PaginateDepartmentsUseCaseResponse> {
    const { skip, take } = params

    const departments = await this.departmentService.paginateDepartments(
      skip,
      take,
    )

    return {
      departments,
    }
  }
}
