import { ProductService } from '@/application/services'

interface GetProductUseCaseParams {
  id: string
}

export class GetProductUseCase {
  constructor(private productService: ProductService) {}

  async execute(params: GetProductUseCaseParams) {
    const { id } = params

    const product = await this.productService.findProductById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
    }
  }
}
