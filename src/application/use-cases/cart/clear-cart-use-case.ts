import { CartService, ProductService } from '@/application/services'

interface ClearCartUseCaseParams {
  userId: string
  cartId: string
}

export class ClearCartUseCase {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async execute(params: ClearCartUseCaseParams) {
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
