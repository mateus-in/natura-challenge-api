import { CartService, ProductService } from '@/application/services'
import { Cart } from '@/domain/entities'

interface ClearCartUseCaseParams {
  userId: string
  cartId: string
}

interface ClearCartUseCaseResponse {
  cart: Cart
}

export class ClearCartUseCase {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async execute(
    params: ClearCartUseCaseParams,
  ): Promise<ClearCartUseCaseResponse> {
    const { cartId, userId } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== userId) {
      throw new Error('Unauthorized user')
    }

    const updatedCart = await this.cartService.clearCart(cart.id)

    cart.items.map(async (item) => {
      await this.productService.updateProduct(item.product.id, {
        name: item.product.name,
        description: item.product.description,
        price: item.product.price,
        stockQuantity: item.product.stockQuantity + item.quantity,
      })
    })

    return {
      cart: updatedCart,
    }
  }
}
