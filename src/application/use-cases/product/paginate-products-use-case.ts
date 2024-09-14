import { ProductService } from '@/application/services'
import { Product } from '@/domain/entities'
import { Paginate } from '@/domain/interfaces'

interface PaginateProductsUseCaseParams {
  departmentId?: string
  categoryId?: string
  skip?: number
  take?: number
}

export class PaginateProductsUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(params: PaginateProductsUseCaseParams) {
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
      products: products.items.map((product) => {
        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          stockQuantity: product.stockQuantity,
        }
      }),
      pagination: {
        count: products.pagination.count,
        limit: products.pagination.limit,
        currentPage: products.pagination.currentPage,
        pagesCount: products.pagination.pagesCount,
      },
    }
  }
}
