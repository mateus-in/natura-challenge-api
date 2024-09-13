import { CartService, ProductService } from '@/application/services'
import { Cart } from '@/domain/entities'

interface AddItemToCartUseCaseParams {
  cartId: string
  productId: string
  quantity: number
}

interface AddItemToCartUseCaseResponse {
  cart: Cart
}

export class AddItemToCartUseCase {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async execute(
    params: AddItemToCartUseCaseParams,
  ): Promise<AddItemToCartUseCaseResponse> {
    const { cartId, productId, quantity } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    const product = await this.productService.findProductById(productId)

    if (!product) {
      throw new Error('Product not found')
    }

    const updatedCart = await this.cartService.addItemToCart({
      cart,
      product,
      quantity,
    })

    await this.productService.updateProduct(product.id, {
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity - quantity,
    })

    return {
      cart: updatedCart,
    }
  }
}
