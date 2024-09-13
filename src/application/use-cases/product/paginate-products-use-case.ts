import { ProductService } from '@/application/services'
import { Product } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

interface PaginateProductUseCaseParams {
  departmentId?: string
  categoryId?: string
  skip?: number
  take?: number
}

interface PaginateProductUseCaseResponse {
  products: Paginate<Product>
}

export class PaginateProductUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(
    params: PaginateProductUseCaseParams,
  ): Promise<PaginateProductUseCaseResponse> {
    const { skip, take, departmentId, categoryId } = params

    let products: Paginate<Product>

    if (categoryId) {
      products = await this.productService.paginateProductsByCategory(
        categoryId,
        skip,
        take,
      )
    } else if (departmentId) {
      products = await this.productService.paginateProductsByDepartment(
        departmentId,
        skip,
        take,
      )
    } else {
      products = await this.productService.paginateProducts(skip, take)
    }

    return {
      products,
    }
  }
}
