import { Category, Product } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

export interface ProductRepository {
  associateCategories(id: string, categoryIds: string[]): Promise<Category[]>
  findById(id: string): Promise<Product | null>
  paginate(skip?: number, take?: number): Promise<Paginate<Product>>
  paginateByCategory(
    categoryId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>>
  paginateByDepartment(
    departmentId: string,
    skip?: number,
    take?: number,
  ): Promise<Paginate<Product>>
  save(product: Product): Promise<Product>
  update(product: Product): Promise<Product>
}
