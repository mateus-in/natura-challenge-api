import { CartService, ProductService } from '@/application/services'

interface UpdateItemQuantityUseCaseParams {
  userId: string
  cartId: string
  cartItemId: string
  quantity: number
}

export class UpdateItemQuantityUseCase {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async execute(params: UpdateItemQuantityUseCaseParams) {
    const { userId, cartId, cartItemId, quantity } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== userId) {
      throw new Error('Unauthorized user')
    }

    const cartItemToUpdate = cart.items.find((item) => item.id === cartItemId)

    if (!cartItemToUpdate) {
      throw new Error('Cart item not found')
    }

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
      id: updatedCart.id,
      user: {
        id: updatedCart.user.id,
        email: updatedCart.user.email,
        name: updatedCart.user.name,
      },
      items: updatedCart.items.map((item) => {
        return {
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            stockQuantity: item.product.stockQuantity,
          },
          quantity: item.quantity,
        }
      }),
    }
  }
}
