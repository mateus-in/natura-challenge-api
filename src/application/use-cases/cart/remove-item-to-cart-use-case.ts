import { CartService, ProductService } from '@/application/services'
import { Cart } from '@/domain/entities'

interface RemoveItemToCartUseCaseParams {
  userId: string
  cartId: string
  cartItemId: string
}

interface RemoveItemToCartUseCaseResponse {
  cart: Cart
}

export class RemoveItemToCartUseCase {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async execute(
    params: RemoveItemToCartUseCaseParams,
  ): Promise<RemoveItemToCartUseCaseResponse> {
    const { userId, cartId, cartItemId } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== userId) {
      throw new Error('Unauthorized user')
    }

    const cartItem = cart.items.find((item) => item.id === cartItemId)

    const updatedCart = await this.cartService.removeItemToCart(
      cart.id,
      cartItemId,
    )

    await this.productService.updateProduct(cartItem.product.id, {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      stockQuantity: cartItem.product.stockQuantity + cartItem.quantity,
    })

    return {
      cart: updatedCart,
    }
  }
}
