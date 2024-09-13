import { CategoryService, ProductService } from '@/application/services'
import { Category } from '@/domain/entities'

interface CreateProductUseCaseParams {
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryIds: string[]
}

interface CreateProductUseCaseResponse {
  product: {
    id: string
    name: string
    description: string
    price: number
    stockQuantity: number
    categories: Category[]
  }
}

export class CreateProductUseCase {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  async execute(
    params: CreateProductUseCaseParams,
  ): Promise<CreateProductUseCaseResponse> {
    const { name, description, price, stockQuantity, categoryIds } = params

    const product = await this.productService.createProduct({
      name,
      description,
      price,
      stockQuantity,
    })

    const categories =
      await this.categoryService.findManyCategoriesByIds(categoryIds)

    if (categories.length !== categoryIds.length) {
      throw new Error('One or more categories not found')
    }

    await this.productService.associateCategories(product.id, categoryIds)

    return {
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        categories,
      },
    }
  }
}
