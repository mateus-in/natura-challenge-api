import { ProductService } from '@/application/services'
import { Product } from '@/domain/entities'

interface GetProductUseCaseParams {
  id: string
}

interface GetProductUseCaseResponse {
  product: Product
}

export class GetProductUseCase {
  constructor(private productService: ProductService) {}

  async execute(
    params: GetProductUseCaseParams,
  ): Promise<GetProductUseCaseResponse> {
    const { id } = params

    const product = await this.productService.findProductById(id)

    if (!product) {
      throw new Error('Product not found')
    }

    return {
      product,
    }
  }
}
