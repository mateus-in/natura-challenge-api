import { CartService, OrderService, UserService } from '@/application/services'

interface CreateOrderUseCaseParams {
  userId: string
  cartId: string
}

export class CreateOrderUseCase {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  async execute(params: CreateOrderUseCaseParams) {
    const { userId, cartId } = params

    const user = await this.userService.findUserById(userId)

    if (!user) {
      throw new Error('User not found')
    }

    const cart = await this.cartService.findCartById(cartId)

    if (!cart) {
      throw new Error('Cart not found')
    }

    if (cart.user.id !== user.id) {
      throw new Error('Unauthorized user')
    }

    const order = await this.orderService.createOrderFromCart(cart, user)

    return {
      id: order.id,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      items: order.items.map((item) => {
        return {
          id: item.id,
          product: {
            id: item.product.id,
            name: item.product.name,
            description: item.product.description,
            price: item.product.price,
            stockQuantity: item.product.stockQuantity,
          },
          price: item.price,
          quantity: item.quantity,
        }
      }),
      price: order.price,
    }
  }
}
