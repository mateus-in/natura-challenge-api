import { Department } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

export interface DepartmentRepository {
  findById(id: string): Promise<Department | null>
  findByName(name: string): Promise<Department | null>
  paginate(skip?: number, take?: number): Promise<Paginate<Department>>
  save(department: Department): Promise<Department>
  update(department: Department): Promise<Department>
}
