import { CartService, ProductService } from '@/application/services'

interface RemoveItemToCartUseCaseParams {
  userId: string
  cartId: string
  cartItemId: string
}

export class RemoveItemToCartUseCase {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  async execute(params: RemoveItemToCartUseCaseParams) {
    const { userId, cartId, cartItemId } = params

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== userId) {
      throw new Error('Unauthorized user')
    }

    const cartItem = cart.items.find((item) => item.id === cartItemId)

    if (!cartItem) {
      throw new Error('Cart item not found')
    }

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
