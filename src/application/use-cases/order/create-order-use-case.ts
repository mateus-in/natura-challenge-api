import { CartService, OrderService, UserService } from '@/application/services'
import { Order } from '@/domain/entities'

interface CreateOrderUseCaseParams {
  userId: string
  cartId: string
}

interface CreateOrderUseCaseResponse {
  order: Order
}

export class CreateOrderUseCase {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  async execute(
    params: CreateOrderUseCaseParams,
  ): Promise<CreateOrderUseCaseResponse> {
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
      order,
    }
  }
}
