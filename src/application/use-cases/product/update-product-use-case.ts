import { ProductService } from '@/application/services'

interface UpdateProductUseCasParams {
  id: string
  name: string
  description: string
  price: number
  stockQuantity: number
}

export class UpdateProductUseCase {
  constructor(private readonly productService: ProductService) {}

  async execute(params: UpdateProductUseCasParams) {
    const { id, name, description, price, stockQuantity } = params

    const product = await this.productService.updateProduct(id, {
      name,
      description,
      price,
      stockQuantity,
    })

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
    }
  }
}
