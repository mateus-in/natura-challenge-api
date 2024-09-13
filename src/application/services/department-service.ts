import { Department } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'
import { DepartmentRepository } from '@/domain/repositories'

interface CreateDepartmentParams {
  name: string
  description: string
}

interface UpdateDepartmentParams {
  name: string
  description: string
}

export class DepartmentService {
  constructor(private departmentRepository: DepartmentRepository) {}

  async createDepartment(params: CreateDepartmentParams): Promise<Department> {
    const { name, description } = params

    const departmentAlreadyExists =
      await this.departmentRepository.findByName(name)

    if (departmentAlreadyExists) {
      throw new Error('Department already exists')
    }

    return await this.departmentRepository.save(
      new Department({
        name,
        description,
      }),
    )
  }

  async findDepartmentById(id: string): Promise<Department | null> {
    return await this.departmentRepository.findById(id)
  }

  async findDepartmentByName(name: string): Promise<Department | null> {
    return await this.departmentRepository.findByName(name)
  }

  async paginateDepartments(
    skip?: number,
    take?: number,
  ): Promise<Paginate<Department>> {
    return await this.departmentRepository.paginate(skip, take)
  }

  async updateDepartment(
    id: string,
    params: UpdateDepartmentParams,
  ): Promise<Department> {
    const { name, description } = params

    const departmentToUpdate = await this.departmentRepository.findById(id)

    if (!departmentToUpdate) {
      throw new Error('Department not found')
    }

    const departmentByName = await this.departmentRepository.findByName(name)

    const hasAnotherDepartmentWithSameName =
      departmentByName && departmentByName.id !== id

    if (hasAnotherDepartmentWithSameName) {
      throw new Error('Department with the same name already exists')
    }

    departmentToUpdate.update({
      name,
      description,
    })

    return await this.departmentRepository.update(departmentToUpdate)
  }
}
