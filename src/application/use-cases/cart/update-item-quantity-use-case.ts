import { CartService, ProductService } from '@/application/services'
import { Cart } from '@/domain/entities'

interface UpdateItemQuantityUseCaseParams {
  userId: string
  cartId: string
  cartItemId: string
  quantity: number
}

interface UpdateItemQuantityUseCaseResponse {
  cart: Cart
}

export class UpdateItemQuantityUseCase {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async execute(
    params: UpdateItemQuantityUseCaseParams,
  ): Promise<UpdateItemQuantityUseCaseResponse> {
    const { userId, cartId, cartItemId, quantity } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== userId) {
      throw new Error('Unauthorized user')
    }

    const cartItemToUpdate = cart.items.find((item) => item.id === cartItemId)

    const updatedCart = await this.cartService.updateItemQuantity(
      cart.id,
      cartItemToUpdate.id,
      quantity,
    )

    await this.productService.updateProduct(cartItemToUpdate.product.id, {
      name: cartItemToUpdate.product.name,
      description: cartItemToUpdate.product.description,
      price: cartItemToUpdate.product.price,
      stockQuantity: cartItemToUpdate.product.stockQuantity - quantity,
    })

    return {
      cart: updatedCart,
    }
  }
}
