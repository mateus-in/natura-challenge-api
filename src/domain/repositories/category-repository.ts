import { Category } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

export interface CategoryRepository {
  findById(id: string): Promise<Category | null>
  findManyByIds(ids: string[]): Promise<Category[]>
  paginate(skip?: number, take?: number): Promise<Paginate<Category>>
  paginateByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Category>>
  save(category: Category): Promise<Category>
  update(category: Category): Promise<Category>
}
