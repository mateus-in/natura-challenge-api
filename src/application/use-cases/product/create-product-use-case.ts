import { CategoryService, ProductService } from '@/application/services'

interface CreateProductUseCaseParams {
  name: string
  description: string
  price: number
  stockQuantity: number
  categoryIds: string[]
}

export class CreateProductUseCase {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly productService: ProductService,
  ) {}

  async execute(params: CreateProductUseCaseParams) {
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
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      categories: categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          description: category.description,
        }
      }),
    }
  }
}
